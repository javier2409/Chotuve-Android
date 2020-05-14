import React, { useState, useCallback, useContext } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useTheme, useNavigation, useFocusEffect} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {AuthContext} from '../login/AuthContext';

// ------------------------------------SOLO PARA TESTEAR-----------------------------------------------------------
const data = [
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
// ---------------------------------------------------------------------------------------------------------------

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
  const [_a, _b, server] = useContext(AuthContext);
  const [videoList, setVideoList] = useState([]);
  
  fetchVideos = useCallback(() => {
    setVideoList([]);
    server.getVideos().then(result => setVideoList(result));
  });

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
