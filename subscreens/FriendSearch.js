import * as React from 'react';
import {useContext, useState} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import FriendItem from './../components/FriendItem';
import {AuthContext} from "../login/AuthContext";

export default function FriendSearch ({navigation}){
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [userData, server] = useContext(AuthContext);

    navigation.setOptions({
        headerTitle: 'Añadir amigo'
    });

    function updateSearch(text){
        setSearch(text);
        server.getUserSearch(text).then(result => {
            setSearchResult(result);
        })
    }

    return (
        <View style={styles.container}>
            <SearchBar placeholder='Buscar...' onChangeText={updateSearch} value={search} />
            <FlatList
                data={searchResult}
                renderItem={({item}) => {
                    const {email} = item;
                    return (
                        <FriendItem data={item} onPress={() => {
                            navigation.navigate('UserProfile', {email})
                        }}/>
                    );
                }}
                keyExtractor={item => item.email}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 0
    },
});