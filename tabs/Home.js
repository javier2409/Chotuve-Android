import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {AuthContext} from '../login/AuthContext';
import {ThemeContext} from "../Styles";
import * as firebase from "firebase";

function VideoItem(props) {
    const {styles} = useContext(ThemeContext);
    const [thumbnail, setThumbnail] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        firebase.storage().ref().child(props.videoData.thumbnail_url).getDownloadURL().then(result => {
            setThumbnail(result);
        })
    }, [props.videoData.thumbnail_url]);

    function isToday(date){
        const today = new Date()
        return (
            (date.getDay() === today.getDay()) &&
            (date.getMonth() === today.getMonth()) &&
            (date.getFullYear() === today.getFullYear())
        )
    }

    function isYesterday(date){
        const today = new Date();
        date.setDate(date.getDate() + 1);
        return isToday(date);
    }

    function getDate(date){
        const [year, month, day] = date.substring(0, 10).split('-');
        const video_date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (isToday(video_date)){
            return 'Hoy';
        }
        if (isYesterday(video_date)){
            return 'Ayer';
        }
        return `${year} - ${month} - ${day}`
    }

    return (
        <TouchableOpacity
            style={styles.homeVideoItem}
            onPress={() => {
                navigation.navigate('Video', props.videoData);
            }}
        >
            <View style={{flexDirection: 'column'}}>
                <Image source={{uri: thumbnail}}
                       style={{width: '100%', aspectRatio: 16/9}}
                       PlaceholderContent={<ActivityIndicator/>}
                />
                <View style={{flex: 1, padding: 10}}>
                    <Text style={styles.homeVideoTitle}>{props.videoData.title}</Text>
                    <Text style={styles.homeVideoSubtitle}>{props.videoData.author} - {getDate(props.videoData.timestamp)}</Text>
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
                keyExtractor={item => toString(item.video_id)}
            />
        </View>
    );
}

