import React, {useContext, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {ThemeContext} from "../Styles";
import {AuthContext} from "../utilities/AuthContext";
import VideoPreview from './VideoPreview';

export default function VideoItem({video_id, shouldHavePreview, hideAuthor}) {
    
    const {styles} = useContext(ThemeContext);
    const [, server] = useContext(AuthContext);
    const navigation = useNavigation();
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [loading, setLoading] = useState(true);
    const [thumbnail, setThumbnail] = useState(null);
    const [firebaseURL, setFirebaseURL] = useState(null);

    useEffect(() => {
        setLoading(true);
        server.getVideoInfo(video_id).then(result => {
            setAuthor(result.author);
            setTitle(result.title);
            setTimestamp(result.timestamp);
            setFirebaseURL(result.firebase_url);
            server.getFirebaseDirectURL(result.thumbnail_url).then(thumbnail => {
                setThumbnail(thumbnail);
                setLoading(false);
            });
        });
    }, []);

    function isToday(date){
        const today = new Date()
        return (
            (date.getDate() === today.getDate()) &&
            (date.getMonth() === today.getMonth()) &&
            (date.getFullYear() === today.getFullYear())
        )
    }

    function isYesterday(date){
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

    if (loading){
        return (
            <></>
        )
    }

    return (
        <TouchableOpacity
            style={styles.homeVideoItem}
            onPress={() => {
                navigation.navigate("Video", {video_id});
            }}
        >
            <View style={{flexDirection: 'column'}}>               
                {shouldHavePreview? 
                <VideoPreview firebase_url={firebaseURL} thumbnail_url={thumbnail} />:
                <Image source={{uri: thumbnail}} style={{width: '100%', aspectRatio: 16/9}} />}
                <View style={{flex: 1, padding: 10}}>
                    <Text style={styles.homeVideoTitle}>{title}</Text>
                    <Text style={styles.homeVideoSubtitle}>
                        {hideAuthor? <></> :
                            <Text>{author} - </Text>
                        }
                        <Text>{getDate(timestamp)}</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
