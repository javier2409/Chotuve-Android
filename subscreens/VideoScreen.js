import React from 'react';
import { StyleSheet, View } from "react-native"
import { useTheme } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function VideoScreen({route}){
    const {colors} = useTheme();
    const {video_url, title, author, description} = route.params;
    return (
        <View style={{...styles.container, ...{backgroundColor: colors.background}}}>
          <Video
            style={styles.video}
            source={{uri: video_url}}
            useNativeControls
            shouldPlay
            resizeMode={Video.RESIZE_MODE_CONTAIN}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    video: {
      width: '100%',
      aspectRatio: 16/9
    }
});
