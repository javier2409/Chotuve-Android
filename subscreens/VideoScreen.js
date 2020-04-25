import React from 'react';
import { StyleSheet, View } from "react-native"
import { useTheme } from '@react-navigation/native';

export default function VideoScreen({route}){
    const {colors} = useTheme();
    return (
        <View style={{...styles.container, ...{backgroundColor: colors.background}}}>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
