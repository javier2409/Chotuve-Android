import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function MyProfile() {
  const {colors} = useTheme();
  return (
      <View style={{...styles.container, ...{backgroundColor: colors.background}}}>
          <Text style={{color: colors.text}}>Mi perfil</Text>
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