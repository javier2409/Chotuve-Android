import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {AuthContext} from '../login/AuthContext';

function VideoItem(props) {
    const {colors} = useTheme();
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{...styles.videoitem, ...{backgroundColor: colors.lighterbackground}}} onPress={() => {
            navigation.navigate('Video', props.videoData);
        }}>
            <View style={{flexDirection: 'column'}}>
                <Image source={{uri: props.videoData.thumbnail_url}} style={{width: '100%', aspectRatio: 16/9}} PlaceholderContent={<ActivityIndicator/>}/>
                <View style={{flex: 1, padding: 10}}>
                    <Text style={{color: colors.text, fontSize: 16, fontWeight: 'bold'}}>{props.videoData.title}</Text>
                    <Text style={{color: colors.text, fontSize: 12}}>{props.videoData.author} - {props.videoData.timestamp}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function Home({navigation}) {
    const {colors} = useTheme();
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
        <View style={styles.container}>
            <FlatList
                refreshing={false}
                style={{...styles.flatlist, ...{backgroundColor: colors.background}}}
                data={videoList}
                renderItem={({item}) => {
                    return <VideoItem videoData={item}/>;
                }}
                onRefresh={fetchVideos}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoitem: {
        marginVertical: 5,
        padding: 0,
        // alignItems: 'stretch'
    },
    flatlist: {
        backgroundColor: '#242424',
    },
});
