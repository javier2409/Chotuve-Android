import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Tabs from './Tabs';
import { NavigationContainer } from '@react-navigation/native';
import Text from 'react-native';
const Stack = createStackNavigator();

const Theme = {
  dark: true,
  colors: {
    title: 'rgb(255,255,255)',
    primary: 'rgb(200,33,33)',
    background: 'rgb(0,0,0)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(245,240,240)',
    border: 'rgb(100,0,0)',
    lighterbackground: 'rgb(20,20,20)'
  },
};

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator screenOptions={{
        headerTintColor: Theme.colors.title,
        headerStyle: {backgroundColor: Theme.colors.primary},
      }}>
        <Stack.Screen name="Chotuve" component={Tabs}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
