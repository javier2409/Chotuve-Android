import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ListItem, Divider } from 'react-native-elements';
import { FlatList } from 'react-native';

let friends=[
  {
    name: 'Santiago'
  },
  {
    name: 'Franco'
  },
  {
    name: 'Sebastian'
  },
  {
    name: 'Javier'
  }
];


function FriendItem(props){
  const {colors} = useTheme();
  const {name} = props.data;
  return (
    <ListItem 
      Component={TouchableOpacity}
      containerStyle={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}
      title={name}
      titleStyle={{...styles.text, ...{color: colors.text}}}
      chevron
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
