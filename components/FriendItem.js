import { useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

export default function FriendItem(props){
    const {colors} = useTheme();
    const {email, full_name, avatar_url} = props.data;
    return (
        <ListItem 
            Component={TouchableOpacity}
            containerStyle={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}
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
