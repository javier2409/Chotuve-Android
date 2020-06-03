import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useContext } from 'react';
import Tabs from './Tabs';
import { NavigationContainer } from '@react-navigation/native';
import {StyleSheet, StatusBar, AsyncStorage} from 'react-native';
import VideoScreen from './subscreens/VideoScreen';
import ChatScreen from './subscreens/ChatScreen';
import FriendSearch from './subscreens/FriendSearch';
import UserProfile from './subscreens/UserProfile';
import { AppLoading } from 'expo';
import LoginScreen from './login/LoginScreen';
import { AuthContext, AuthContextProvider } from './login/AuthContext';
import RegisterScreen from './login/RegisterScreen';
import RecoverPasswordScreen from './login/RecoverPasswordScreen';
import Preferences from "./subscreens/Preferences";

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
            <Stack.Screen name="Chotuve" component={Tabs} />
            <Stack.Screen name="Video" component={VideoScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Friend Search" component={FriendSearch} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="Preferencias" component={Preferences} />
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
            <Stack.Screen name="Restablecer contraseña" component={RecoverPasswordScreen} />
        </Stack.Navigator>
    )
}

function Main() {

    const [userData, serverProxy] = useContext(AuthContext);
    const [ready, setReady] = useState(false);

    async function fetchToken(){
        try {
            const username = await AsyncStorage.getItem('USERNAME');
            const password = await AsyncStorage.getItem('PASSWORD');
            console.log(`Credentials saved in async storage: ${username}, ${password}`);
            await serverProxy.tryLogin(username, password);
        } catch(e) {
            serverProxy.updateUserData(null);
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
        <NavigationContainer theme={Theme}>
            <StatusBar/>
            {userData ? (
                <MainApp/>
            ) : (
                <LoginScreens/>
            )}
        </NavigationContainer>
    );
}

export default function App(){
    return(
        <AuthContextProvider>
            <Main/>
        </AuthContextProvider>
    )
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
