import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { Icon } from 'react-native-elements';
import Friends from './tabs/Friends';
import Home from './tabs/Home';
import MyProfile from './tabs/MyProfile';
import Upload from './tabs/Upload';

const BottomTab = createMaterialBottomTabNavigator();

export default function Tabs() {
  return (
    <BottomTab.Navigator initialRouteName="Home" shifting={false} inactiveColor= '#bbbbbb' barStyle={{backgroundColor: '#990000'}} >
      <BottomTab.Screen name="Home" component={Home} options={{
          tabBarIcon: ({focused, color}) => {
              return <Icon name='home' color={color}/>
        }}
      } />
      <BottomTab.Screen name="Upload" component={Upload} options={{
          tabBarIcon: ({focused, color}) => {
              return <Icon name='add-circle' color={color}/>
        }}
      } />
      <BottomTab.Screen name="Profile" component={MyProfile} options={{
          tabBarIcon: ({focused, color}) => {
              return <Icon name='person' color={color}/>
        }}
      } />
      <BottomTab.Screen name="Friends" component={Friends} options={{
          tabBarIcon: ({focused, color}) => {
              return <Icon name='people' color={color}/>
        }}
      } />
    </BottomTab.Navigator>
  );
}
