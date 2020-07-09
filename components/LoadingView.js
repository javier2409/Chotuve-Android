import React, {useContext} from "react";
import {View, ActivityIndicator} from 'react-native';
import {ThemeContext} from '../Styles';

export default function LoadingView(){
    const {styles} = useContext(ThemeContext);
    
    return (
        <View style={styles.loadingStyle}>
            <ActivityIndicator/>
        </View>
    )
}