import { useTheme } from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import FriendItem from './../components/FriendItem';
import {AuthContext} from "../utilities/AuthContext";
import {ThemeContext} from "../Styles";

export default function Friends({navigation}) {
    const {styles, colors} = useContext(ThemeContext);
    const [friends, setFriends] = useState([]);
    const [userData, server] = useContext(AuthContext);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            server.getFriendList().then(result => {
                setFriends(result);
            })
        })
    }, [navigation])

    return (
        <View style={styles.flexContainer}>
            <FlatList
                data={friends}
                renderItem={({item}) => {
                    const {user_id} = item;
                    return (
                        <FriendItem data={user_id} onPress={() => {
                            navigation.navigate('Chat', user_id)
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
