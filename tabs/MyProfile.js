import React from 'react';
import { StyleSheet } from 'react-native';
import UserProfile from './../subscreens/UserProfile';

const myName = "Javier";

export default function MyProfile({navigation}) {
  return (
      <UserProfile 
        route={{
          params: {
            name: myName
          }
        }}
        navigation={navigation}
      />
  );
}

const styles = StyleSheet.create({
});
