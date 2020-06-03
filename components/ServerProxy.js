import * as firebase from 'firebase';
import * as facebook from 'expo-facebook';
import * as google from 'expo-google-app-auth';
import getEnv from "../environment";

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

    //update saved user data globally
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
        console.log('Trying to get token ID');
        const token = await credential.user.getIdToken();
        console.log(`Obtained token ID from firebase: ${token.substring(0, 30)}...`);
        console.log(credential.user.displayName);
        console.log(credential.user.email);
        let provider = 'email';
        if (credential.credential) {
            //delete ".com" from provider
            provider = credential.credential.providerId.slice(0, -4);
        }
        console.log(provider);
        this.updateLocalUserData(credential.user);
        if (credential.additionalUserInfo.isNewUser){
            console.log("The user is new, sending to AppServer");
            await this._request('/users', 'POST', {
                "fullname": credential.user.full_name,
                "email": credential.user.email,
                "login-method": provider
            });
        }
        this.updateGlobalUserData(credential.user);
    }

    //manage login failure
    manageFailure = reason => {
        alert(reason);
    }

    //send a request to appserver
    async _request(path, method, body){
        const token = await this.user.getIdToken();
        console.log("Fetching " + method + " " + apiUrl + path + " with body:");
        console.log(body);
        const response = await fetch(apiUrl+path, {
            method,
            body: body? JSON.stringify(body) : null,
            headers: {
                "x-access-token": token
            }
        });

        const response_json = await response.json();
        console.log("Response:");
        console.log(response_json);
        return response_json;
    }

    //log out from account
    logOut(){
        this.updateGlobalUserData(null);
    }

    //get auth token from username and password
    async tryLogin(user, pass){
        if (user && pass) {
            try {
                const loginResult = await firebase.auth().signInWithEmailAndPassword(user, pass);
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
        return await this._request('/videos', 'GET', null);
    }

    //get information to show user profile
    async getUserInfo(username){
        const user={
            avatar_uri: 'xd',
            full_name: 'Javier Ferreyra',
            friends: false,
            videos: [
                {
                    id: '1',
                    title: 'Videazo',
                    author: 'autorazo',
                    description: 'Dale like y suscribete',
                    thumbnail_uri: 'https://images.wallpaperscraft.com/image/city_vector_panorama_119914_3840x2160.jpg',
                    video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                    timestamp: '2020-04-28'
                },
                {
                    id: '2',
                    title: 'Especial 1 suscriptor',
                    author: 'autorazo',
                    description: 'Dale like y suscribete',
                    thumbnail_uri: 'https://images.wallpaperscraft.com/image/city_vector_panorama_119914_3840x2160.jpg',
                    video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                    timestamp: '2020-04-28'
                }
            ]
        };

        return user;
    }

    //get information to show my own profile
    async getMyInfo(){
        return this.getUserInfo('javier')
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
        let comments = [];
        for (let i=0; i<30; i++){
            comments.push({
                id: i.toString(),
                author: 'SomeGuy '+i,
                text: 'Hola soy el comentario '+i,
                timestamp: '2020-05-13'
            })
        }
        return comments.concat(this.published_comments);        
    }

    //get list of users that match the search
    async getUserSearch(search){
        if (search.length < 1){
            return []
        }
        const results=[
            {
                email: 'santi78434',
                full_name: 'Santiago Mariani',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                email: 'fran_giordano',
                full_name: 'Franco Giordano',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                email: 'sebalogue',
                full_name: 'Sebastian Loguercio',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                email: 'javiferr',
                full_name: 'Javier Ferreyra',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            }
        ];
        console.log(`Searching ${search} now`);
        const filtered = results.filter(user => user.email.includes(search));
        return filtered;
    }

    //send a new video
    async publishVideo(video_data){
        console.log(video_data);
    }

    //send a new comment
    async publishComment(comment_data){
        const {video_id, text} = comment_data;
        const new_comment = {
            video_id: video_id,
            text: text,
        }
        this.published_comments.push(new_comment);
    }

    //send a message to another user
    async sendMessage(message_data){

    }

    //get a list of my friends
    async getFriendList(){
        let friends=[
            {
                email: 'santi78434',
                full_name: 'Santiago Mariani',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                email: 'fran_giordano',
                full_name: 'Franco Giordano',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                email: 'sebalogue',
                full_name: 'Sebastian Loguercio',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                email: 'javiferr',
                full_name: 'Javier Ferreyra',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            }
        ];
        return friends
    }

    //send a friend request
    async addFriend(username){
        return 'Success'
    }

    //send a request to get a reset password code
    async requestResetPasswordEmail(email){

    }

    //send reset password code with new password
    async sendCodeAndNewPassword(code, newPassword){

    }

    //send new profile picture
    async changeProfilePicture(){

    }
}
