import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {ThemeContext} from "../Styles";
import {AuthContext} from "../utilities/AuthContext";

export default function VideoItem(props) {
    const {styles} = useContext(ThemeContext);
    const [user, server] = useContext(AuthContext);
    const [thumbnail, setThumbnail] = useState(null);
    const navigation = useNavigation();
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const video_id = props.video_id;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        server.getVideoInfo(video_id).then(result => {
            setAuthor(result.author);
            setTitle(result.title);
            setTimestamp(result.timestamp);
            return server.getFirebaseDirectURL(result.thumbnail_url);
        }).then(result => {
            setThumbnail(result);
            setLoading(false);
        })
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

    if (loading){
        return (
            <></>
        )
    }

    return (
        <TouchableOpacity
            style={styles.homeVideoItem}
            onPress={() => {
                navigation.navigate('Video', video_id);
            }}
        >
            <View style={{flexDirection: 'column'}}>
                <Image source={{uri: thumbnail}}
                       style={{width: '100%', aspectRatio: 16/9}}
                       PlaceholderContent={<ActivityIndicator/>}
                />
                <View style={{flex: 1, padding: 10}}>
                    <Text style={styles.homeVideoTitle}>{title}</Text>
                    <Text style={styles.homeVideoSubtitle}>{author} - {getDate(timestamp)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
