import React from 'react';
import { View } from "react-native";

export default function UserProfile({route, navigation}){
    const {name} = route.params;
    navigation.setOptions({
        headerTitle: 'Perfil de ' + name
    });
    return (
        <View>

        </View>
    );
}
