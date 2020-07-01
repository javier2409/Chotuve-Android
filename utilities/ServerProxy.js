import * as firebase from 'firebase';
import * as facebook from 'expo-facebook';
import * as google from 'expo-google-app-auth';
import getEnv from "../environment";
import {AsyncStorage} from "react-native";

const firebaseConfig = {
    apiKey: "AIzaSyDlBeowWP8UPWsvk9kXj9JDaN5_xsuNu4I",
    authDomain: "chotuve-videos.firebaseapp.com",
    databaseURL: "https://chotuve-videos.firebaseio.com",
    projectId: "chotuve-videos",
    storageBucket: "chotuve-videos.appspot.com",
    messagingSenderId: "662757364228",
    appId: "1:662757364228:web:02d934f2819b5d58581b51"
};

firebase.initializeApp(firebaseConfig);

const apiUrl = getEnv().apiUrl;

export class ServerProxy{

    constructor(setUserData){
        this.user = null;
        this.setUserData = setUserData;
        this.userCache = {};
        this.urlCache = {}
    }

    //update user data for the entire app
    updateGlobalUserData(user){
        this.updateLocalUserData(user);
        this.setUserData(user)
    }

    //update user data for this object
    updateLocalUserData(user){
        this.user = user;
    }

    //manage login success
    manageCredential = async credential => {
        try {
            console.log('Trying to get token ID');
            const token = await credential.user.getIdToken();
            console.log(`Obtained token ID from firebase: ${token}`);
            console.log(credential.user.displayName);
            console.log(credential.user.email);
            this.updateLocalUserData(credential.user);
            if (credential.additionalUserInfo.isNewUser) {
                console.log("The user is new, sending to AppServer");
                await this._request('/users', 'POST', {
                    display_name: credential.user.displayName,
                    email: credential.user.email,
                    phone_number: credential.user.phoneNumber
                });
            }
            console.log("Requesting user ID");
            const response = await this._request('/auth', 'GET', null);
            console.log("User ID: " + response.id);
            credential.user.uuid = response.id;
            console.log("Saving login method: " + credential.additionalUserInfo.providerId);
            await AsyncStorage.setItem("LOGIN_METHOD", credential.additionalUserInfo.providerId);
            this.updateGlobalUserData(credential.user);
        } catch(error) {
            this.updateGlobalUserData(null);
            return Promise.reject("Error enviando datos al servidor");
        }
    }

    //manage login failure
    manageFailure = reason => {
        console.log("Login failed: " + reason);
        alert(reason);
    }

    //send a request to appserver
    async _request(path, method, body = undefined, headers = undefined){
        const token = await this.user.getIdToken();
        console.log("Requesting using token: " + token.substring(0,50));
        const json_body = body ? JSON.stringify(body) : null;
        console.log("Fetching " + method + " " + apiUrl + path + " with body:");
        console.log((typeof json_body) + " " + json_body);
        const response = await fetch(apiUrl+path, {
            method: method,
            headers: {
                "x-access-token": token,
                "Content-Type": 'application/json',
                "Connection": 'keep-alive',
                ...headers
            },
            body: json_body
        });

        if (!response.ok){
            console.log("Response not OK: " + response.status);
            return Promise.reject("Response not OK");
        }
        const response_json = await response.json();
        console.log("Response:");
        console.log(response_json);
        return response_json;
    }

    //log out from account
    async logOut(){
        await AsyncStorage.setItem("LOGIN_METHOD", "none");
        this.updateGlobalUserData(null);
    }

    //get auth token from username and password
    async tryLogin(user, pass){
        if (user && pass) {
            try {
                const loginResult = await firebase.auth().signInWithEmailAndPassword(user, pass);
                await AsyncStorage.setItem("USERNAME", user);
                await AsyncStorage.setItem("PASSWORD", pass);
                await this.manageCredential(loginResult);
            } catch (error) {
                this.manageFailure(error);
                return Promise.reject();
            }
        } else {
            return Promise.reject();
        }
    }

    //get auth token using facebook
    async tryFacebookLogin(){
        const appId = "591659228371489";

        try {
            await facebook.initializeAsync(appId);
            const facebookLoginResult = await facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email']
            })

            if (facebookLoginResult.type === 'success') {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                const credential = firebase.auth.FacebookAuthProvider.credential(facebookLoginResult.token);
                const loginResult = await firebase.auth().signInWithCredential(credential);
                await this.manageCredential(loginResult);
            } else {
                return Promise.reject('No se ha podido iniciar sesión');
            }
        } catch(error){
            this.manageFailure(error);
            return Promise.reject();
        }
    }

    //get auth token using google
    async tryGoogleLogin() {
        try {
            const googleLoginResult = await google.logInAsync({
                androidClientId: `662757364228-7cm7fs8d3e5r22tdbk0mandpqhsm3876.apps.googleusercontent.com`,
                androidStandaloneAppClientId: `662757364228-7cm7fs8d3e5r22tdbk0mandpqhsm3876.apps.googleusercontent.com`,
            });

            if (googleLoginResult.type === 'success') {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                const credential = firebase.auth.GoogleAuthProvider.credential(googleLoginResult.idToken);
                const loginResult = await firebase.auth().signInWithCredential(credential);
                await this.manageCredential(loginResult);
            } else {
                return Promise.reject('No se ha podido iniciar sesión');
            }
        } catch (error){
            this.manageFailure(error);
            return Promise.reject('Error al ingresar.');
        }
    }

    //send new user and get auth token from firebase
    async registerNewUser(user_data){
        const {email, password, full_name} = user_data;
        try{
            const registerResult = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await registerResult.user.updateProfile({
                displayName: full_name
            });
            await registerResult.user.reload();
            await this.manageCredential(registerResult);
        } catch (error){
            console.log(error);
            return Promise.reject('Hubo un error al crear la cuenta');
        }
    }

    //get video feed
    async getVideos(){
        try {
            const result = await this._request("/videos", "GET", null);
            return (result);
        } catch (e) {
            return Promise.reject("Error al recibir la lista de videos");
        }
    }

    //get information to show user profile
    async getUserInfo(uid){
        if (this.userCache[uid]){
            return this.userCache[uid];
        }

        try {
            const response = await this._request('/users/' + uid, 'GET', null);
            this.userCache[uid] = response;
            return response;
        } catch (e) {
            return Promise.reject("Error el obtener información del usuario");
        }
    }

    //get videos from one user
    async getUserVideos(uid){
        try {
            const response = await this._request('/users/' + uid + '/videos', 'GET', null);
            return response;
        } catch (e) {
            return Promise.reject("Error el obtener videos del usuario");
        }
    }

    //get the username from user id
    async getUserName(uid){
        if (this.userCache[uid]){
            return this.userCache[uid].display_name
        }

        try {
            const response = await this._request(`/users/${uid}`, 'GET', null);
            this.userCache[uid] = response;
            return response.display_name;
        } catch (e) {
            return Promise.reject("Error al obtener nombre de usuario");
        }
    }

    //get direct url from firebase path
    async getFirebaseDirectURL(path){
        if (this.urlCache[path]){
            return this.urlCache[path];
        }

        try {
            const url = await firebase.storage().ref().child(path).getDownloadURL();
            this.urlCache[path] = url;
            return url;
        } catch (e) {
            return Promise.reject("El archivo no existe en el servidor");
        }
    }

    //get information to show my own profile
    async getMyInfo(){
        return this.getUserInfo(this.user.uuid);
    }

    //get messages between me and a friend
    async getChatInfo(uid){
        try {
            const messages = await this._request(`/messages/${uid}?page=1&per_page=50`, 'GET');
            return messages;
        } catch (e) {
            return Promise.reject("No se pudieron obtener los mensajes del chat.");
        }
    }

    //get comments from a video
    async getVideoComments(video_id){
        try {
            const response = await this._request("/videos/" + video_id + "/comments", 'GET', null);
            return (response);
        } catch (e) {
            return Promise.reject("Error al obtener los comentarios");
        }
    }

    //get list of users that match the search
    async getUserSearch(search){
        try {
            const users = await this._request(`/users?name=${search}&per_page=20&page=1`, 'GET', null);
            return (users.users);
        } catch (e) {
            return Promise.reject("Error al realizar la búsqueda");
        }
    }

    //send a new video
    async publishVideo(video_data){
        try{
            const response = await this._request('/videos', 'POST', {
                title: video_data.title,
                description: video_data.description,
                location: video_data.location,
                firebase_url: video_data.video_uri,
                thumbnail_url: video_data.thumbnail_uri,
                is_private: video_data.is_private
            });
            return "ok";
        } catch (e) {
            return Promise.reject("Error al enviar video al servidor")
        }
    }

    //send a new comment
    async publishComment(comment_data){
        try{
            await this._request('/videos/' + comment_data.video_id + '/comments', 'POST', {
                text: comment_data.text,
                vid_time: comment_data.vid_time
            })
        } catch (e) {
            return Promise.reject("Error al publicar comentario");
        }
    }

    //send a message to another user
    async sendMessage(message, destination_uid){
        try {
            return await this._request(`/messages/${destination_uid}`, 'POST', {
                text: message
            })
        } catch (e) {
            return Promise.reject("No se pudo enviar el mensaje");
        }
    }

    async reactToVideo(reaction, id){
        try {
            await this._request(`/videos/${id}/reactions`, 'POST', {
                likes_video: (reaction === 'like')
            });
        } catch (e) {
            return Promise.reject("Error al reaccionar al video");
        }
    }

    //get a list of my friends
    async getFriendList(){
        try {
            const response = await this._request(`/users/${this.user.uuid}/friends`, 'GET');
            return response.friends;
        } catch (e) {
            return Promise.reject("Error al obtener la lista de amigos");
        }
    }
    
    //get friend requests
    async getFriendRequests(){
        try {
            const response = await this._request(`/users/${this.user.uuid}/friends/requests`, 'GET', null);
            return response.pending_reqs;
        } catch (e) {
            return Promise.reject("Error al obtener las solicitudes de amistad");
        }
    }

    //answer a friend request, true = accept, false = deny
    async answerFriendRequest(uuid, answer){
        try {
            await this._request(`/users/${this.user.uuid}/friends/requests/${uuid}`, 'POST', {
               "accept": answer
            });
        } catch (e) {
            return Promise.reject("No se pudo completar la solicitud");
        }
    }
    
    //send a friend request
    async addFriend(uid){
        try {
            await this._request(`/users/${uid}/friends/requests`, 'POST', null);
            return "ok";
        } catch (e) {
            return Promise.reject("Error al enviar solicitud de amistad");
        }
    }

    //send a request to get a reset password code
    async requestResetPasswordEmail(email){
        
    }

    //send reset password code with new password
    async sendCodeAndNewPassword(code, newPassword){

    }

    //send new profile picture
    async changeProfilePicture(url){
        try {
            await this._request(`/users/${this.user.uuid}`, 'PUT', {
                "image_location": url
            });
            return "ok"
        } catch (e) {
            return Promise.reject("Error al cambiar la imagen de perfil");
        }
    }

    //send new user information
    async changeMyUserData(user_data){

        this.userCache[this.user.uuid] = null;

        try {
            await this._request(`/users/${this.user.uuid}`, 'PUT', {
                display_name: user_data.full_name,
                phone_number: user_data.phone_number
            })
        } catch (e) {
            return Promise.reject("Error al actualizar la información");
        }
    }

    //send push token to appserver to receive notifications
    async sendPushToken(token){

    }
}
