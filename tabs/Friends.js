import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Friends() {
  const {colors} = useTheme();
  return (
      <View style={{...styles.container, ...{backgroundColor: colors.background}}}>
          <Text style={{color: colors.text}}>Lista de amigos</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
