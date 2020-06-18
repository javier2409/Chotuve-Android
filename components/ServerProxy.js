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
        this.published_videos = [];
        this.published_comments = [];
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
            console.log("Saving login method: " + credential.user.providerId);
            await AsyncStorage.setItem("LOGIN_METHOD", credential.user.providerId);
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
    async _request(path, method, body, headers = null){
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
                "Accept": '*/*',
                "Accept-Encoding": 'gzip, deflate, br',
                "Connection": 'keep-alive',
                ...headers
            },
            body: json_body
        });

        if (!response.ok){
            console.log("Response not OK");
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
        try {
            let response = await this._request('/users/' + uid, 'GET', null);
            response.videos = await this._request('/users/' + uid + '/videos', 'GET', null);
            return response;
        } catch (e) {
            return Promise.reject("Error el obtener información del usuario");
        }
    }

    //get the username from user id
    async getUserName(uid){
        try {
            const response = await this._request(`/users/${uid}`, 'GET', null);
            return response.display_name;
        } catch (e) {
            return Promise.reject("Error al obtener nombre de usuario");
        }
    }

    //get direct url from firebase path
    async getFirebaseDirectURL(path){
        try {
            return await firebase.storage().ref().child(path).getDownloadURL();
        } catch (e) {
            return Promise.reject("El archivo no existe en el servidor");
        }
    }

    //get information to show my own profile
    async getMyInfo(){
        return this.getUserInfo(this.user.uuid);
    }

    //get messages between me and a friend
    async getChatInfo(username){
        const messages=[
            {
                id: '1',
                email: 'fran_giordano',
                msg: 'Hola, todo bien?'
            },
            {
                id: '2',
                email: 'javiferr',
                msg: 'Holaaa todo bien y vos?'
            },
            {
                id: '3',
                email: 'fran_giordano',
                msg: 'Viste esta nueva app Chotuve? Dicen que esta buenisima'
            },
        ];
        return messages;
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
            const users = await this._request('/users', 'GET', null, {
                "q": search
            });
            return (users);
        } catch (e) {
            return Promise.reject("Error al realizar la búsqueda");
        }
    }

    //send a new video
    async publishVideo(video_data){
        try{
            const response = this._request('/videos', 'POST', {
                title: video_data.title,
                description: video_data.description,
                location: video_data.location,
                firebase_url: video_data.video_uri,
                thumbnail_url: video_data.thumbnail_uri
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
                text: comment_data.text
            })
        } catch (e) {
            return Promise.reject("Error al publicar comentario");
        }
    }

    //send a message to another user
    async sendMessage(message_data){

    }

    //get a list of my friends
    async getFriendList(){
        try {
            const response = await this._request(`/users/${this.user.uuid}/friends`, 'GET', null);
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
        try {
            await this._request(`/users/${this.user.uuid}`, 'PUT', {
                display_name: user_data.full_name,
                phone_number: user_data.phone_number
            })
        } catch (e) {
            return Promise.reject("Error al actualizar la información");
        }
    }
}
