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
        return data;
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
            })
        }
        return comments        
    }

    //get list of users that match the search
    async getUserSearch(search){
        const results=[
            {
                name: 'Santiago',
                full_name: 'Santiago Mariani',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'Franco',
                full_name: 'Franco Giordano',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'Sebastian',
                full_name: 'Sebastian Loguercio',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'Javier',
                full_name: 'Javier Ferreyra',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            }
        ];
        return results
    }

    //send a new video
    async publishVideo(video_data){

    }

    //send a new comment
    async publishComment(comment_data){

    }

    //get a list of my friends
    async getFriendList(){
        let friends=[
            {
                name: 'Santiago',
                full_name: 'Santiago Mariani',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'Franco',
                full_name: 'Franco Giordano',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'Sebastian',
                full_name: 'Sebastian Loguercio',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            },
            {
                name: 'Javier',
                full_name: 'Javier Ferreyra',
                avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
            }
        ];
        return friends
    }
}

export const server = new ServerProxy();
