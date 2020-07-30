import * as firebase from 'firebase';
import * as facebook from 'expo-facebook';
import * as google from 'expo-google-app-auth';
import getEnv from "../environment";
import {AsyncStorage} from "react-native";
import {codes} from "./ErrorCodes";
import { log } from './Logger';

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
        this.urlCache = {};
        this.videoCache = {}
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
        let token;
        let response;
        log('Trying to get token ID');
        try {
            token = await credential.user.getIdToken();
        } catch (error) {
            this.updateGlobalUserData(null);
            return Promise.reject("Error de autenticación" + ` (Error ${codes.AUTH_ERROR})`);
        }
        log(`Obtained token ID from firebase:`, token);
        log(credential.user.displayName);
        log(credential.user.email);
        this.updateLocalUserData(credential.user);
        if (credential.additionalUserInfo.isNewUser) {
            log("The user is new, sending to AppServer");
            try {
                await this._request('/users', 'POST', {
                    display_name: credential.user.displayName,
                    email: credential.user.email,
                    phone_number: credential.user.phoneNumber
                });
            } catch (errno) {
                this.updateGlobalUserData(null);
                return Promise.reject("Error al registrar la cuenta en nuestros servidores" + ` (Error ${errno})`)
            }
        }
        log("Requesting user ID");
        try {
            response = await this._request('/users/auth', 'GET', null);
        } catch (errno) {
            this.updateGlobalUserData(null);
            return Promise.reject("Error al obtener ID de usuario " + ` (Error ${errno})`);
        }
        log("User ID: " + response.id);
        credential.user.uuid = response.id;
        log("Saving login method: " + credential.additionalUserInfo.providerId);
        try {
            await AsyncStorage.setItem("LOGIN_METHOD", credential.additionalUserInfo.providerId);
        } catch (error) {
            this.updateGlobalUserData(null);
            return Promise.reject("Error al guardar el método de ingreso");
        }
        this.updateGlobalUserData(credential.user);
    }

    //manage login failure
    manageFailure = reason => {
        log("Login failed: " + reason);
        alert(reason);
    }

    //send a request to appserver
    async _request(path, method, body = undefined, headers = undefined, useToken = true){
        let token;
        let json_body;
        let response;
        
        try {
            if (useToken){
                token = await this.user.getIdToken();
            } else {
                token = null;
            }
        } catch (error) {
            return Promise.reject(codes.AUTH_ERROR);
        }
        
        json_body = body ? JSON.stringify(body) : null;
        log(`Fetching ${method} ${path} ${body? `with body: ` : ""}`, body);
        
        try {
            response = await fetch(apiUrl+path, {
                method: method,
                headers: {
                    "x-access-token": token,
                    "Content-Type": 'application/json',
                    "Connection": 'keep-alive',
                    ...headers
                },
                body: json_body
            });
        } catch (error) {
            return Promise.reject(codes.FETCH_ERROR);
        }

        if (!response.ok){
            log("Response not OK: " + response.status);
            return Promise.reject(response.status);
        }
        const response_json = await response.json();
        log(`Response from: ${method} ${path}`, response_json);
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
            let loginResult;
            try {
                loginResult = await firebase.auth().signInWithEmailAndPassword(user, pass);
            } catch (error) {
                return Promise.reject("No se ha podido iniciar sesión, intente nuevamente");
            }
            try {
                await AsyncStorage.setItem("USERNAME", user);
                await AsyncStorage.setItem("PASSWORD", pass);
            } catch (error) {
                return Promise.reject("Error al guardar tus credenciales, intente nuevamente");
            }
            try {
                await this.manageCredential(loginResult);
            } catch (error) {
                return Promise.reject(error);
            }
        } else {
            return Promise.reject("No se ha especificado usuario/contraseña");
        }
    }

    //get auth token using facebook
    async tryFacebookLogin(){
        const appId = "591659228371489";
        let facebookLoginResult;
        let loginResult;
        try {
            await facebook.initializeAsync(appId);
            facebookLoginResult = await facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email']
            });
        } catch (errno) {
            return Promise.reject("No se ha podido iniciar sesión en Facebook");
        }
        if (facebookLoginResult.type === 'success') {
            try {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            } catch(error) {
                return Promise.reject("Hubo un error inesperado, intente nuevamente");
            }
            const credential = firebase.auth.FacebookAuthProvider.credential(facebookLoginResult.token);
            try {
                loginResult = await firebase.auth().signInWithCredential(credential);
            } catch(error) {
                return Promise.reject("Error al procesar la credencial");
            }
            try {
                await this.manageCredential(loginResult);
            } catch(error) {
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('No se ha iniciado sesión en Facebook');
        }
    }

    //get auth token using google
    async tryGoogleLogin() {
        let googleLoginResult;
        let loginResult;
        try {
            try {
                googleLoginResult = await google.logInAsync({
                    androidClientId: `662757364228-m15ds1tuf8ueb24gohagmg5mrhcpk8ls.apps.googleusercontent.com`,
                    androidStandaloneAppClientId: `662757364228-7cm7fs8d3e5r22tdbk0mandpqhsm3876.apps.googleusercontent.com`,
                });
            } catch (error) {
                return Promise.reject("No se ha podido iniciar sesion con Google");
            }
            if (googleLoginResult.type === 'success') {
                try {
                    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                } catch (error) {
                    return Promise.reject("Hubo un error inesperado");
                }
                const credential = firebase.auth.GoogleAuthProvider.credential(googleLoginResult.idToken);
                try {
                    loginResult = await firebase.auth().signInWithCredential(credential);
                } catch(error) {
                    return Promise.reject("Error al procesar la credencial");
                }
                try {
                    await this.manageCredential(loginResult);
                } catch(error) {
                    return Promise.reject(error)
                }
            } else {
                return Promise.reject('No se ha iniciado sesión en Google');
            }
        } catch (error){
            this.manageFailure(error);
            return Promise.reject('Error al ingresar.');
        }
    }

    //send new user and get auth token from firebase
    async registerNewUser(user_data){
        const {email, password, full_name} = user_data;
        let registerResult;
        try {
            registerResult = await firebase.auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            return Promise.reject("Hubo un error al crear el usuario" + ` \n(${error})`);
        }
        try {
            await registerResult.user.updateProfile({
                displayName: full_name
            });
            await registerResult.user.reload();
        } catch (_) {
            return Promise.reject("Hubo un error inesperado");
        }
        try {
            await this.manageCredential(registerResult);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //get video feed
    async getVideos(invalidateCache = false){
        invalidateCache? this.videoCache = {}:{};
        try {
            const result = await this._request("/videos", "GET", null);
            return (result.videos);
        } catch (errno) {
            return Promise.reject(`Error al obtener el feed de videos (Error ${errno})`);
        }
    }

    //get all the information from a video except comments
    async getVideoInfo(id, forceFetch = false){
        if (forceFetch || !this.videoCache[id]){
            try {
                this.videoCache[id] = await this._request("/videos/"+id, "GET", null);
            } catch (errno) {
                return Promise.reject(`Error al recibir información del video (Error ${errno})`);
            }        
        }
        return this.videoCache[id];
    }

    //request deletion of a video
    async deleteVideo(video_id){
        try {
            const response = await this._request(`/videos/${video_id}`, "DELETE");
            this.videoCache[video_id] = null;
        } catch (errno) {
            return Promise.reject(`Error al eliminar video `+`(Error ${errno})`);
        }
    }

    //change video information
    async modifyVideo(video_id, title, desc, location, friendsonly){
        this.videoCache[video_id] = null;
        try {
            const response = await this._request(`/videos/${video_id}`, 'PATCH', {
                title: title,
                description: desc,
                location: location,
                is_private: friendsonly
            });
        } catch (errno) {
            return Promise.reject("Error al modificar video" +` (Error ${errno})`);
        }       
    } 

    //get information to show user profile
    async getUserInfo(uid, forceFetch = false){
        if (forceFetch || !this.userCache[uid]){
            try {
                this.userCache[uid] = await this._request('/users/' + uid, 'GET', null);
            } catch (errno) {
                return Promise.reject("Error el obtener información del usuario" + ` (Error ${errno})`);
            }
        }
        return this.userCache[uid];
    }

    //get videos from one user
    async getUserVideos(uid, invalidateCache = false){
        invalidateCache? this.videoCache = {}:{};
        try {
            const response = await this._request('/users/' + uid + '/videos', 'GET', null);
            return response;
        } catch (errno) {
            return Promise.reject("Error el obtener videos del usuario" + ` (Error ${errno})`);
        }
    }

    //get the username from user id
    async getUserName(uid, forceFetch = false){
        if (forceFetch || !this.userCache[uid]){
            try {
                this.userCache[uid] = await this._request(`/users/${uid}`, 'GET', null);
            } catch (errno) {
                return Promise.reject("Error al obtener nombre de usuario" + ` (Error ${errno})`);
            }
        }
        return this.userCache[uid].display_name;
    }

    //get direct url from firebase path
    async getFirebaseDirectURL(path){
        if (!this.urlCache[path]){
            log("URL not in cache: " + path);
            try {
                this.urlCache[path] = await firebase.storage().ref().child(path).getDownloadURL();
            } catch (errno) {
                return Promise.reject("El archivo no existe en el servidor");
            }
        } else {
            log("Using cache: " + path);
        }
        return this.urlCache[path];
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
        } catch (errno) {
            return Promise.reject("No se pudieron obtener los mensajes del chat" + ` (Error ${errno})`);
        }
    }

    //get comments from a video
    async getVideoComments(video_id){
        try {
            const response = await this._request("/videos/" + video_id + "/comments", 'GET', null);
            return (response);
        } catch (errno) {
            return Promise.reject("Error al obtener los comentarios" + ` (Error ${errno})`);
        }
    }

    //get list of users that match the search
    async getUserSearch(search){
        try {
            const users = await this._request(`/users?name=${search}&per_page=20&page=1`, 'GET', null);
            return (users.users);
        } catch (errno) {
            return Promise.reject("Error al realizar la búsqueda" + ` (Error ${errno})`);
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
        } catch (errno) {
            return Promise.reject("Error al enviar video al servidor" + ` (Error ${errno})`)
        }
    }

    //send a new comment
    async publishComment(comment_data){
        try{
            await this._request('/videos/' + comment_data.video_id + '/comments', 'POST', {
                text: comment_data.text,
                vid_time: comment_data.vid_time
            })
        } catch (errno) {
            return Promise.reject("Error al publicar comentario" + ` (Error ${errno})`);
        }
    }

    //send a message to another user
    async sendMessage(message, destination_uid){
        try {
            return await this._request(`/messages/${destination_uid}`, 'POST', {
                text: message
            })
        } catch (errno) {
            return Promise.reject("No se pudo enviar el mensaje" + ` (Error ${errno})`);
        }
    }

    //add a reaction (like=true, dislike=false) to a video given it's id
    async reactToVideo(reaction, id){
        try {
            await this._request(`/videos/${id}/reactions`, 'POST', {
                likes_video: (reaction === 'like')
            });
        } catch (errno) {
            return Promise.reject("Error al reaccionar al video" + ` (Error ${errno})`);
        }
    }

    //change the reaction of a video
    async changeVideoReaction(reaction, id){
        try {
            await this._request(`/videos/${id}/reactions`, 'PATCH', {
                likes_video: (reaction === 'like')
            });
        } catch (errno) {
            return Promise.reject("Error al modificar reaccion del video" + ` (Error ${errno})`);
        }
    }

    //get a list of my friends
    async getFriendList(invalidateCache = false){
        if (invalidateCache){
            this.userCache = {}
        }
        try {
            const response = await this._request(`/users/${this.user.uuid}/friends`, 'GET');
            return response.friends;
        } catch (errno) {
            return Promise.reject("Error al obtener la lista de amigos" + ` (Error ${errno})`);
        }
    }
    
    //get friend requests
    async getFriendRequests(){
        try {
            const response = await this._request(`/friend-requests`, 'GET', null);
            return response.pending_reqs;
        } catch (errno) {
            return Promise.reject("Error al obtener las solicitudes de amistad" + ` (Error ${errno})`);
        }
    }

    //answer a friend request, true = accept, false = deny
    async answerFriendRequest(uuid, answer){
        try {
            await this._request(`/friend-requests/${uuid}`, 'POST', {
               "accept": answer
            });
        } catch (errno) {
            return Promise.reject("No se pudo completar la solicitud" + ` (Error ${errno})`);
        }
    }
    
    //send a friend request
    async addFriend(uid){
        try {
            await this._request(`/friend-requests`, 'POST', {
                to: uid
            });
            return "ok";
        } catch (errno) {
            return Promise.reject("Error al enviar solicitud de amistad" + ` (Error ${errno})`);
        }
    }

    async deleteFriend(uid){
        try{
            await this._request(`/users/${this.user.uuid}/friends/${uid}`, 'DELETE');
        } catch (errno) {
            return Promise.reject("Error al eliminar amistad" + ` (Error ${errno})`);
        }
    }

    //send new profile picture
    async changeProfilePicture(url){
        this.urlCache[url] = null;
        try {
            await this._request(`/users/${this.user.uuid}`, 'PATCH', {
                "image_location": url
            });
            return "ok"
        } catch (errno) {
            return Promise.reject("Error al cambiar la imagen de perfil" + ` (Error ${errno})`);
        }
    }
    
    //send new user information
    async changeMyUserData(user_data){
        try {
            await this._request(`/users/${this.user.uuid}`, 'PATCH', {
                display_name: user_data.full_name,
                phone_number: user_data.phone_number
            })
            
            if (this.userCache[this.user.uuid]){
                this.userCache[this.user.uuid]["display_name"] = user_data.full_name;
                this.userCache[this.user.uuid]["phone_number"] = user_data.phone_number;
            }

        } catch (errno) {
            return Promise.reject("Error al actualizar la información" + ` (Error ${errno})`);
        }
    }
    
    //send push token to appserver to receive notifications
    async sendPushToken(token){
        try {
            return await this._request(`/tokens`, 'POST', {
                "push_token": token
            });
        } catch (errno) {
            return Promise.reject("Error el enviar el token de notificaciones" + ` (Error ${errno})`);
        }
    }
    
    //send a request to get a reset password code
    async requestResetPasswordEmail(email){
        try{
            return await this._request(`/users/reset-codes`, 'POST', {
                email: email
            }, null, false);
        } catch (errno) {
            return Promise.reject("Hubo un error al solicitar el codigo" + ` (Error ${errno})`);
        }
    }
    
    //send reset password code with new password
    async sendCodeAndNewPassword(email, code, newPassword){
        try {
            return await this._request(`/users/change-password`, 'POST', {
                email: email,
                reset_code: code,
                password: newPassword
            }, null, false);
        } catch (errno) {
            return Promise.reject("Hubo un error al actualizar la contraseña" + ` (Error ${errno})`);
        }
    }

    //search videos
    async searchVideos(query){
        try {
            const result = await this._request(`/videos?search=${query}`, 'GET');
            return result.videos
        } catch (errno) {
            return Promise.reject("Error realizar la búsqueda" + ` (Error ${errno})`);
        }
    }
}
