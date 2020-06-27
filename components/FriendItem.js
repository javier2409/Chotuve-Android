import { useTheme } from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import {ThemeContext} from "../Styles";
import {AuthContext} from "../utilities/AuthContext";

export default function FriendItem(props){
    const {styles, colors} = useContext(ThemeContext);
    const [user, server] = useContext(AuthContext);
    const uid = props.data;
    const [fullName, setFullName] = useState(null);
    const [email, setEmail] = useState(null);
    const [avatarURL, setAvatarURL] = useState(null);

    useEffect(() => {
       server.getUserInfo(uid).then(result => {
           setFullName(result.display_name);
           setEmail(result.email);
           if (result.image_location){
               server.getFirebaseDirectURL(result.image_location).then(setAvatarURL, null);
           }
       })
    });

    return (
        <ListItem 
            Component={TouchableOpacity}
            containerStyle={{...styles.friendItem, ...{backgroundColor: colors.lighterbackground}}}
            title={fullName}
            titleStyle={{...styles.title, ...{color: colors.text}}}
            subtitle={email}
            subtitleStyle={{...styles.subtitle, ...{color: colors.grey}}}
            chevron
            leftAvatar={{source:{uri: avatarURL}}}
            onPress={props.onPress}
        />
    );
}

