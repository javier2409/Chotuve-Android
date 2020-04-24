import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyProfile() {
  return (
      <View style={styles.container}>
          <Text style={{color: '#ffffff'}}>Mi perfil</Text>
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
