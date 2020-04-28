import { useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Icon, SearchBar } from 'react-native-elements';
let results=[
    {
        name: 'Santiago',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    },
    {
        name: 'Franco',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    },
    {
        name: 'Sebastian',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    },
    {
        name: 'Javier',
        avatar_url: 'https://cdn2.iconfinder.com/data/icons/web-mobile-2-1/64/user_avatar_admin_web_mobile_business_office-512.png'
    }
];
  
function FriendItem(props){
    const {colors} = useTheme();
    const navigation = useNavigation();
    const {name, avatar_url} = props.data;
    return (
        <ListItem 
            Component={TouchableOpacity}
            containerStyle={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}
            title={name}
            titleStyle={{...styles.title, ...{color: colors.text}}}
            chevron
            leftAvatar={{source:{uri: avatar_url}}}
            onPress={() => {
                navigation.navigate("UserProfile", props.data);
            }}
        />
    );
}

export default function FriendSearch ({navigation}){
    const {colors} = useTheme();
    navigation.setOptions({
        headerTitle: () => {
            return (
                <SearchBar 
                    platform='android' 
                    placeholder='Buscar amigos'
                    containerStyle={{
                        backgroundColor: '#00000000'
                    }}
                    cancelIcon={null}
                />
            );
        }
    });
    return (
        <View>
            <FlatList
                data={results}
                renderItem={({item}) => {
                    return (
                        <FriendItem data={item}/>
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
    }
});