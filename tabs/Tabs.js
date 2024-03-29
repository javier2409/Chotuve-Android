import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, {useContext} from 'react';
import { Icon } from 'react-native-elements';
import Friends from './Friends';
import Home from './Home';
import MyProfile from './MyProfile';
import Upload from './Upload';
import {ThemeContext} from "../Styles";
import Notifications from "./Notifications";

const BottomTab = createMaterialBottomTabNavigator();

export default function Tabs({navigation}) {
    const {colors} = useContext(ThemeContext);
    navigation.setOptions({
    header: () => {return null}
    });
    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            shifting={true}
            activeColor={colors.highlight}
            inactiveColor={colors.border}
            barStyle={{
                backgroundColor: colors.primary
            }}
            style={{
                backgroundColor: colors.background
            }}
        >
        <BottomTab.Screen name="Home" component={Home} options={{
            tabBarIcon: ({color}) => {
                return <Icon name='home' color={color}/>
            }}
        } />
        <BottomTab.Screen name="Publicar" component={Upload} options={{
            tabBarIcon: ({color}) => {
                return <Icon name='cloud-upload' color={color}/>
            }}
        } />
        <BottomTab.Screen name="Perfil" component={MyProfile} options={{
            tabBarIcon: ({color}) => {
                return <Icon name='person' color={color}/>
            }}
        } />
        <BottomTab.Screen name="Amigos" component={Friends} options={{
            tabBarIcon: ({color}) => {
                return <Icon name='people' color={color}/>
            }}
        } />
        <BottomTab.Screen name="Notificaciones" component={Notifications} options={{
            tabBarIcon: ({color}) => {
                return <Icon name='notifications' color={color}/>
            }}
        } />
        </BottomTab.Navigator>
  );
}
