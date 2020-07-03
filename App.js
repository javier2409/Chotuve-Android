import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, useContext, useEffect} from 'react';
import Tabs from './tabs/Tabs';
import { NavigationContainer } from '@react-navigation/native';
import {StatusBar, AsyncStorage} from 'react-native';
import VideoScreen from './subscreens/VideoScreen';
import ChatScreen from './subscreens/ChatScreen';
import FriendSearch from './subscreens/FriendSearch';
import UserProfile from './subscreens/UserProfile';
import { AppLoading } from 'expo';
import LoginScreen from './login/LoginScreen';
import { AuthContext, AuthContextProvider } from './utilities/AuthContext';
import RegisterScreen from './login/RegisterScreen';
import RecoverPasswordScreen from './login/RecoverPasswordScreen';
import Preferences from "./subscreens/Preferences";
import {ThemeContext, ThemeContextProvider} from "./Styles";
import ignoreWarnings from 'react-native-ignore-warnings';
import {Notifications} from "expo";
import {navigate, navigationRef} from "./utilities/RootNavigation";
import * as Permissions from "expo-permissions";

ignoreWarnings('Setting a timer');

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
    const {colors} = useContext(ThemeContext);
    const [user, server] = useContext(AuthContext);

    useEffect(() => {
        const subscription = Notifications.addListener(notification => {
            console.log("Notification info:");
            console.log(notification);
            if (notification.origin === 'selected'){
                switch (notification.data.type){
                    case 'message':
                        navigate("Chat", {uid: notification.data.uuid});
                        break;
                    case 'comment':
                        navigate("Video", {video_id: notification.data.vid_id});
                        break;
                    default:
                        navigate("Notificaciones");
                }
            }
        })
        return (() => subscription.remove());
    });

    useEffect(() => {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({status}) => {
            if (status !== 'granted'){
                alert('No se pudo obtener permiso para mostrar notificaciones');
            }
        });

        Notifications.getExpoPushTokenAsync().then(token => {
            server.sendPushToken(token).then(null);
            console.log("Push token: " + token);
        });
    });

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: Theme.colors.title,
                headerStyle: {backgroundColor: Theme.colors.primary},
            }}
            style={{
                backgroundColor: colors.background
            }}
        >
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

    const {setLightMode} = useContext(ThemeContext);
    const [userData, serverProxy] = useContext(AuthContext);
    const [ready, setReady] = useState(false);

    async function fetchStorage(){
        const saved_theme = await AsyncStorage.getItem('THEME');
        if (saved_theme === 'light'){
            setLightMode();
        }
        try {
            const loginMethod = await AsyncStorage.getItem('LOGIN_METHOD');
            console.log("Trying " + loginMethod + " login");
            switch (loginMethod) {
                case "password":
                    const username = await AsyncStorage.getItem('USERNAME');
                    const password = await AsyncStorage.getItem('PASSWORD');
                    console.log("Using credentials: " + username + " , " + password);
                    await serverProxy.tryLogin(username, password);
                    break;
                case "facebook.com":
                    //await serverProxy.tryFacebookLogin();
                    serverProxy.updateGlobalUserData(null);
                    break;
                case "google.com":
                    //await serverProxy.tryGoogleLogin();
                    serverProxy.updateGlobalUserData(null);
                    break;
                default:
                    serverProxy.updateGlobalUserData(null);
            }
        } catch(e) {
            serverProxy.updateGlobalUserData(null);
        }
    }

    if (!ready){
        return (
            <AppLoading
                startAsync={fetchStorage}
                onFinish={() => {setReady(true)}}
            />
        )
    }

    return (
        <NavigationContainer theme={Theme} ref={navigationRef}>
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
            <ThemeContextProvider>
                <Main/>
            </ThemeContextProvider>
        </AuthContextProvider>
    )
}
