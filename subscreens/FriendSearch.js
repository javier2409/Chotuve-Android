import * as React from 'react';
import {useContext, useState} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import FriendItem from './../components/FriendItem';
import {AuthContext} from "../utilities/AuthContext";
import {ThemeContext} from "../Styles";

export default function FriendSearch ({navigation}){
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [userData, server] = useContext(AuthContext);
    const {styles} = useContext(ThemeContext);

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
        <View style={styles.flexContainer}>
            <SearchBar placeholder='Buscar...' onChangeText={updateSearch} value={search} />
            <FlatList
                data={searchResult}
                renderItem={({item}) => {
                    const {user_id} = item;
                    const uid = user_id;
                    return (
                        <FriendItem data={user_id} onPress={() => {
                            navigation.navigate('UserProfile', {uid})
                        }}/>
                    );
                }}
                keyExtractor={item => item.email}
            />
        </View>
    );
}
