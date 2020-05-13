
class ServerProxy{

    constructor(){
        this.userData = null;
    }

    //get auth token from username and password
    async getToken(user, pass){
        this.userData = null;
        
        //do fetch stuff...
        await new Promise(r => setTimeout(r, 1000));
        const token = 'abcdefghij'

        if (user === 'invalid'){
            return null
        }
        this.userData={
            token: token,
            username: user
        }
        return token
    }

    //get video feed
    getVideos(){

    }

    //get information to show user profile
    getUserInfo(username){

    }

    //get information to show my own profile
    getMyInfo(){

    }

    //get messages between me and a friend
    getChatInfo(username){

    }

    //get comments from a video
    getVideoComments(video_id){

    }

    //get list of users that match the search
    getUserSearch(search){

    }

    //send a new video
    publishVideo(video_data){

    }

    //send a new comment
    publishComment(comment_data){

    }

    //get a list of my friends
    getFriendList(){

    }
}

export const server = new ServerProxy();