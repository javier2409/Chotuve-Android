import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Tabs from './Tabs';
import { NavigationContainer } from '@react-navigation/native';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import VideoScreen from './subscreens/VideoScreen';
import ChatScreen from './subscreens/ChatScreen';
import FriendSearch from './subscreens/FriendSearch';
import UserProfile from './subscreens/UserProfile';
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
    lighterbackground: 'rgb(20,20,20)',
    highlight: 'rgb(255,200,200)',
    grey: 'rgb(100,100,100'
  },
};

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      <StatusBar/>
      <Stack.Navigator screenOptions={{
        headerTintColor: Theme.colors.title,
        headerStyle: {backgroundColor: Theme.colors.primary},
      }}>
        <Stack.Screen
          name="Chotuve"
          component={Tabs}
          options={{ 
            headerTitle: props => {
              return (
                <View style={styles.header}>
                  <Icon name='navigate-next' color={Theme.colors.highlight}/>
                  <Text style={styles.title}>Chotuve</Text>
                </View>
              )
            },
            headerTitleAlign: 'left'
          }}
        />
        <Stack.Screen name="Video" component={VideoScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Friend Search" component={FriendSearch} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.highlight,
    marginLeft: 10
  }
})