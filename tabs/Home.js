import React, {useContext, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {AuthContext} from '../login/AuthContext';
import {ThemeContext} from "../Styles";
import VideoItem from "../components/VideoItem";

export default function Home({navigation}) {
    const {styles} = useContext(ThemeContext);
    const [userData, server] = useContext(AuthContext);
    const [videoList, setVideoList] = useState([]);

    function fetchVideos(){
        setVideoList([]);
        server.getVideos().then(result => {
            setVideoList(result)
        });
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            if (videoList.length === 0){
                fetchVideos();
            }
        });
    }, [navigation]);

    return (
        <View style={styles.flexContainer}>
            <FlatList
                refreshing={false}
                style={styles.homeFlatList}
                data={videoList}
                renderItem={({item}) => {
                    return <VideoItem videoData={item}/>;
                }}
                onRefresh={fetchVideos}
                keyExtractor={item => item.video_id.toString()}
            />
        </View>
    );
}

