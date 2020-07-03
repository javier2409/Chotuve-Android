import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {AuthContext} from '../utilities/AuthContext';
import {ThemeContext} from "../Styles";
import VideoItem from "../components/VideoItem";
import {useFocusEffect} from "@react-navigation/native";

export default function Home({navigation}) {
    const {styles} = useContext(ThemeContext);
    const [userData, server] = useContext(AuthContext);
    const [videoList, setVideoList] = useState([]);

    function fetchVideos(){
        server.getVideos().then(result => {
            setVideoList(result)
        });
    }

    useEffect(() => {
        if (videoList.length < 1){
            fetchVideos();
        }
    }, [navigation]);

    return (
        <View style={styles.flexContainer}>
            <FlatList
                refreshing={false}
                style={styles.homeFlatList}
                data={videoList}
                renderItem={({item}) => {
                    return <VideoItem video_id={item.video_id}/>;
                }}
                onRefresh={fetchVideos}
                keyExtractor={item => item.video_id.toString()}
            />
        </View>
    );
}
