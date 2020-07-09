import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {AuthContext} from '../utilities/AuthContext';
import {ThemeContext} from "../Styles";
import VideoItem from "../components/VideoItem";
import { SearchBar } from 'react-native-elements';
import LoadingView from '../components/LoadingView';

export default function Home({navigation}) {
    const {styles, colors} = useContext(ThemeContext);
    const [userData, server] = useContext(AuthContext);
    const [videoList, setVideoList] = useState([]);
    const [search, setSearch] = useState("");

    function fetchVideos(forceRefresh = false){

        if (forceRefresh){
            setVideoList([])
        }

        server.getVideos(forceRefresh).then(result => {
            setVideoList(result)
        });
    }

    useEffect(() => {
        if (videoList.length < 1){
            fetchVideos();
        }
    }, [navigation]);

    function searchVideos(){
        if (search.length < 5){
            return
        }
        server.searchVideos(search).then(result => {
            setVideoList(result);
        });
    }

    return (
        <View style={styles.flexContainer}>
            <SearchBar
                placeholder="Buscar videos..."
                onChangeText={setSearch}
                value={search}
                onSubmitEditing={searchVideos}
                round
                containerStyle={{backgroundColor: colors.background}}
                inputContainerStyle={{backgroundColor: colors.lighterbackground}}
                inputStyle={{color: colors.text}}
                style={{backgroundColor: colors.background}}
                lightTheme={colors.themeName == 'Light'}
            />  
            <FlatList
                ListEmptyComponent={<LoadingView/>}
                refreshing={false}
                style={styles.homeFlatList}
                data={videoList}
                renderItem={({item}) => {
                    return <VideoItem video_id={item.video_id}/>;
                }}
                onRefresh={() => {fetchVideos(true)}}
                keyExtractor={item => item.video_id.toString()}
            />          
        </View>
    );
}
