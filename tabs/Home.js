import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {AuthContext} from '../login/AuthContext';
import {ThemeContext} from "../Styles";

function VideoItem(props) {
    const {styles} = useContext(ThemeContext);
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.homeVideoItem} onPress={() => {
            navigation.navigate('Video', props.videoData);
        }}>
            <View style={{flexDirection: 'column'}}>
                <Image source={{uri: props.videoData.thumbnail_url}}
                       style={{width: '100%', aspectRatio: 16/9}}
                       PlaceholderContent={<ActivityIndicator/>}
                />
                <View style={{flex: 1, padding: 10}}>
                    <Text style={styles.homeVideoTitle}>{props.videoData.title}</Text>
                    <Text style={styles.homeVideoSubtitle}>{props.videoData.author} - {props.videoData.timestamp}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function Home({navigation}) {
    const {styles} = useContext(ThemeContext);
    const [userData, server] = useContext(AuthContext);
    const [videoList, setVideoList] = useState([]);

    function fetchVideos(){
        setVideoList([]);
        server.getVideos().then(result => setVideoList(result));
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            fetchVideos();
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
                keyExtractor={item => item.video_id}
            />
        </View>
    );
}

