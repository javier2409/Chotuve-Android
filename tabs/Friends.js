import { useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import FriendItem from './../components/FriendItem';

let friends=[
  {
      name: 'Santiago',
      full_name: 'Santiago Mariani',
      avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  },
  {
      name: 'Franco',
      full_name: 'Franco Giordano',
      avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  },
  {
      name: 'Sebastian',
      full_name: 'Sebastian Loguercio',
      avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  },
  {
      name: 'Javier',
      full_name: 'Javier Ferreyra',
      avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
  }
];

export default function Friends({navigation}) {
  const {colors} = useTheme();
    return (
      <View style={styles.view}>
        <FlatList
          data={friends}
          renderItem={({item}) => {
            const {name, avatar_url} = item;
            return (
              <FriendItem data={item} onPress={() => {
                navigation.navigate('Chat', {name, avatar_url})
              }}/>
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
          onPress={() => {
            navigation.navigate("Friend Search");
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
