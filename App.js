import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, createContext } from 'react';
import Tabs from './Tabs';
import { NavigationContainer } from '@react-navigation/native';
import {Text, View, StyleSheet, StatusBar, AsyncStorage} from 'react-native';
import { Icon } from 'react-native-elements';
import VideoScreen from './subscreens/VideoScreen';
import ChatScreen from './subscreens/ChatScreen';
import FriendSearch from './subscreens/FriendSearch';
import UserProfile from './subscreens/UserProfile';
import { AppLoading } from 'expo';
import LoginScreen from './login/LoginScreen';
import { AuthContext } from './login/AuthContext';
import RegisterScreen from './login/RegisterScreen';

const Stack = createStackNavigator();

const Theme = {
  dark: true,
  colors: {
    title: 'rgb(255,255,255)',
    primary: 'rgb(71,196,71)',
    background: 'rgb(0,0,0)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(240,245,240)',
    border: 'rgb(0,100,0)',
    lighterbackground: 'rgb(20,20,20)',
    highlight: 'rgb(200,255,200)',
    grey: 'rgb(100,100,100)'
  },
};

function MainApp(){
  return (
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
  )
}

function LoginScreens(){
  return(
    <Stack.Navigator screenOptions={{
      headerTintColor: Theme.colors.title,
      headerStyle: {backgroundColor: Theme.colors.primary},
    }}>
      <Stack.Screen name="Ingreso" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegisterScreen} /> 
    </Stack.Navigator>
  )
}

export default function App() {

  const [userData, setUserData] = useState({
    username: null,
    token: null
  });

  const [ready, setReady] = useState(false);

  async function fetchToken(){
    try {
      const username = await AsyncStorage.getItem('USERNAME');
      const password = await AsyncStorage.getItem('PASSWORD');
    } catch(e) {
      setUserData({
        username: null,
        token: null
      });
    }
  }

  if (!ready){
    return (
      <AppLoading
        startAsync={fetchToken}
        onFinish={() => {setReady(true)}}
      />
    )
  }

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      <NavigationContainer theme={Theme}>
        <StatusBar/>
        {userData.token ? (
          <MainApp/>
        ) : (
          <LoginScreens/>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
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
