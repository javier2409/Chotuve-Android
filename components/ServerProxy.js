class ServerProxy{

    constructor(){
        this.userData = null;
        this.published_videos = [];
        this.published_comments = [];
        this.new_users = [];
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
    async getVideos(){
        let data = [
        ];
        
        for (let i = 0; i<20; i++) {
            data.push({
                id: i.toString(),
                title: 'Video '+i,
                author: 'Autor '+i,
                description: 'A normal video',
                video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                thumbnail_url: 'https://images.wallpaperscraft.com/image/city_vector_panorama_119914_3840x2160.jpg',
                timestamp: '2020-04-25',
            });
        }
        return data.concat(this.published_videos);
    }

    //get information to show user profile
    async getUserInfo(username){
        const user={
            avatar_uri: 'xd',
            full_name: 'Javier Ferreyra',
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
                name: 'Franco',
                msg: 'Hola, todo bien?'
            },
            {
                id: '2',
                name: 'Javier',
                msg: 'Holaaa todo bien y vos?'
            },
            {
                id: '3',
                name: 'Franco',
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
        const results=[
            {
                name: 'santi78434',
                full_name: 'Santiago Mariani',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'fran_giordano',
                full_name: 'Franco Giordano',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'sebalogue',
                full_name: 'Sebastian Loguercio',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'javiferr',
                full_name: 'Javier Ferreyra',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            }
        ].concat(this.new_users);

        return results.filter(user => {
            user.name.includes(search);
        })
    }

    //send a new video
    async publishVideo(video_data){
        const {id, title, description, thumbnail_uri, video_url, timestamp} = video_data;
        const new_video = {
            id: id,
            title: title,
            author: this.userData.username,
            description: description,
            thumbnail_uri: thumbnail_uri,
            video_url: video_url,
            timestamp: timestamp   
        }
        this.published_videos.push(new_video);
    }

    //send a new comment
    async publishComment(comment_data){
        const {id, video_id, comment_id, text, timestamp} = comment_data;
        const new_comment = {
            video_id: video_id,
            comment_id: id,
            author: this.userData.username,
            text: text,
            timestamp: timestamp
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
                name: 'santi78434',
                full_name: 'Santiago Mariani',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'fran_giordano',
                full_name: 'Franco Giordano',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'sebalogue',
                full_name: 'Sebastian Loguercio',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'javiferr',
                full_name: 'Javier Ferreyra',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            }
        ];
        return friends
    }

    async registerNewUser(user_data){
        const {username, email, password, full_name} = user_data;
        const new_user = {
            name: username,
            full_name: full_name,
            avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
        };
        this.new_users.push(new_user);
        return 'success';
    }
}

export const server = new ServerProxy();
