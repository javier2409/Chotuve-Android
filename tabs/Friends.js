import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ListItem, Divider } from 'react-native-elements';
import { FlatList } from 'react-native';

let friends=[
  {
    name: 'Santiago',
    avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  },
  {
    name: 'Franco',
    avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  },
  {
    name: 'Sebastian',
    avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  },
  {
    name: 'Javier',
    avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  }
];


function FriendItem(props){
  const {colors} = useTheme();
  const {name, avatar_url} = props.data;
  return (
    <ListItem 
      Component={TouchableOpacity}
      containerStyle={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}
      title={name}
      titleStyle={{...styles.title, ...{color: colors.text}}}
      chevron
      leftAvatar={{source:{uri: avatar_url}}}
    />
  );
}

export default function Friends() {
  const {colors} = useTheme();
    return (
      <View>
        <FlatList
          data={friends}
          renderItem={({item}) => {
            return (
              <FriendItem data={item}/>
            );
          }}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin:3
  },
  title: {

  }
});
