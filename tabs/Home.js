import React, {useContext, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {AuthContext} from '../utilities/AuthContext';
import {ThemeContext} from "../Styles";
import VideoItem from "../components/VideoItem";
import { SearchBar } from 'react-native-elements';
import {ToastError} from '../utilities/ToastError';
import { useRef } from 'react';

export default function Home({navigation}) {
    const {styles, colors} = useContext(ThemeContext);
    const [, server] = useContext(AuthContext);
    const [videoList, setVideoList] = useState([]);
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [currentPreviewId, setCurrentPreviewId] = useState(0);

    function fetchVideos(forceRefresh = false){
        if (forceRefresh){
            setRefreshing(true)
            setVideoList([])
        }
        server.getVideos(forceRefresh).then(result => {
            setVideoList(result)
            setRefreshing(false);
        }, ToastError);
    }

    function searchVideos(){
        if (search.length < 1){
            return
        }
        server.searchVideos(search).then(result => {
            setVideoList(result);
        }, ToastError);
    }

    useEffect(() => {
        if (videoList.length < 1){
            fetchVideos();
        }
    }, [navigation]);

    function disablePreviews(){
        setCurrentPreviewId(0);
        console.log("Setting visible preview to null");
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', disablePreviews);
        return unsubscribe;
    }, [navigation]);

    onViewableItemsChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0){
            setCurrentPreviewId(viewableItems[0].item.video_id);
        } else {
            setCurrentPreviewId(0);
        }
    });

    viewConf = {
        minimumViewTime: 2000,
        itemVisiblePercentThreshold: 100
    };

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
                refreshing={refreshing}
                style={styles.homeFlatList}
                data={videoList}
                renderItem={({item}) => {
                    return <VideoItem video_id={item.video_id} shouldHavePreview={currentPreviewId === item.video_id} />;
                }}
                onRefresh={() => {fetchVideos(true)}}
                keyExtractor={item => item.video_id.toString()}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewConf}
            />         
        </View>
    );
}
