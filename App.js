import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Tabs from './Tabs';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: '#990000'}
      }}>
        <Stack.Screen name="Chotuve" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
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
