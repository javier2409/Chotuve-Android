import React from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import FriendItem from './../components/FriendItem';

let results=[
    {
        name: 'Santiago',
        full_name: 'Santiago Mariani',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    },
    {
        name: 'Franco',
        full_name: 'Franco Giordano',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    },
    {
        name: 'Sebastian',
        full_name: 'Sebastian Loguercio',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    },
    {
        name: 'Javier',
        full_name: 'Javier Ferreyra',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    }
];
  
export default function FriendSearch ({navigation}){
    navigation.setOptions({
        headerTitle: 'Añadir amigo'
    });
    return (
        <View style={styles.container}>
            <SearchBar 
                placeholder='Buscar amigos'
            />
            <FlatList
                data={results}
                renderItem={({item}) => {
                    const {name} = item;
                    return (
                        <FriendItem data={item} onPress={() => {
                            navigation.navigate('UserProfile', {name})
                        }}/>
                    );
                }}
                keyExtractor={item => item.name}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 3
    },
    searchbar: {
        flex: 1,
    }
});