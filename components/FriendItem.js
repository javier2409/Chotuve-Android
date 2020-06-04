import { useTheme } from '@react-navigation/native';
import React, {useContext} from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import {ThemeContext} from "../Styles";

export default function FriendItem(props){
    const {styles, colors} = useContext(ThemeContext);
    const {email, full_name, avatar_url} = props.data;
    return (
        <ListItem 
            Component={TouchableOpacity}
            containerStyle={{...styles.friendItem, ...{backgroundColor: colors.lighterbackground}}}
            title={full_name}
            titleStyle={{...styles.title, ...{color: colors.text}}}
            subtitle={email}
            subtitleStyle={{...styles.subtitle, ...{color: colors.grey}}}
            chevron
            leftAvatar={{source:{uri: avatar_url}}}
            onPress={props.onPress}
        />
    );
}

const styles = StyleSheet.create({
    container: {
      margin:3
    },
    view: {
      flex: 1
    }
});  
