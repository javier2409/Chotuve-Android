import { useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

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
  const navigation = useNavigation();
  const {name, avatar_url} = props.data;
  return (
    <ListItem 
      Component={TouchableOpacity}
      containerStyle={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}
      title={name}
      titleStyle={{...styles.title, ...{color: colors.text}}}
      chevron
      leftAvatar={{source:{uri: avatar_url}}}
      onPress={() => {
        navigation.navigate("Chat", props.data);
      }}
    />
  );
}

export default function Friends() {
  const {colors} = useTheme();
    return (
      <View style={styles.view}>
        <FlatList
          data={friends}
          renderItem={({item}) => {
            return (
              <FriendItem data={item}/>
            );
          }}
          keyExtractor={item => item.name}
        />
        <Icon 
          name='person-add' 
          raised 
          reverse
          color={colors.primary}
          reverseColor={colors.highlight}
          containerStyle={{
            position: 'absolute',
            direction: 'rtl',
            end: 0,
            bottom: 0,
            padding: 10
          }}
        />
      </View>
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
