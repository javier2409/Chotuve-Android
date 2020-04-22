import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function App() {


  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
      <Button title="Hola mundo!"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#af0000',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
