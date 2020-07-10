import * as React from 'react';
import {useContext, useState} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import FriendItem from './../components/FriendItem';
import {AuthContext} from "../utilities/AuthContext";
import {ThemeContext} from "../Styles";
import { ToastError } from '../utilities/ToastError';

export default function FriendSearch ({navigation}){
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [userData, server] = useContext(AuthContext);
    const {styles, colors} = useContext(ThemeContext);

    navigation.setOptions({
        headerTitle: 'Búsqueda de Usuarios'
    });

    function updateSearch(text){
        setSearch(text);
        if (text.length < 3){
            setSearchResult([]);
            return;
        }
        server.getUserSearch(text).then(result => {
            setSearchResult(result);
        }, ToastError);
    }

    return (
        <View style={styles.flexContainer}>
            <SearchBar 
                placeholder='Buscar...' 
                onChangeText={updateSearch} 
                value={search}
                round
                containerStyle={{backgroundColor: colors.background}}
                inputContainerStyle={{backgroundColor: colors.lighterbackground}}
                inputStyle={{color: colors.text}}
                style={{backgroundColor: colors.background}}
                lightTheme={colors.themeName == 'Light'}
            />
            <FlatList
                data={searchResult}
                renderItem={({item}) => {
                    const uid = item.id;
                    return (
                        <FriendItem data={uid} onPress={() => {
                            navigation.navigate('UserProfile', {uid})
                        }}/>
                    );
                }}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}
