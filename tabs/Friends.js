import React, {useContext, useEffect, useState} from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'react-native-elements';
import FriendItem from './../components/FriendItem';
import {AuthContext} from "../utilities/AuthContext";
import {ThemeContext} from "../Styles";
import {ToastError} from '../utilities/ToastError';

export default function Friends({navigation}) {
    const {styles, colors} = useContext(ThemeContext);
    const [friends, setFriends] = useState([]);
    const [, server] = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);

    function getFriends(force = false){
        if (force){
            setFriends([]);
            setRefreshing(true);
        }
        server.getFriendList(invalidateCache = force).then(result => {
            setFriends(result);
            setRefreshing(false);
        }, ToastError);
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            getFriends();
        })
    }, [navigation])

    return (
        <View style={styles.flexContainer}>
            <FlatList
                refreshing={refreshing}
                onRefresh={() => {getFriends(force = true)}}
                data={friends}
                renderItem={({item}) => {
                    const {user_id} = item;
                    return (
                        <FriendItem data={user_id} onPress={() => {
                            navigation.navigate("Chat", {uid: user_id})
                        }}/>
                    );
                }}
                keyExtractor={item => item.user_id.toString()}
            />
            <Icon
                name='person-add'
                raised
                reverse
                color={colors.primary}
                reverseColor={colors.highlight}
                containerStyle={{
                    position: 'absolute',
                    direction: 'rtl',
                    end: 0,
                    bottom: 0,
                    padding: 10
                }}
                onPress={() => {
                    navigation.navigate("Friend Search");
                }}
            />
        </View>
    );
}
