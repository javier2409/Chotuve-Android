import { useNavigation, useTheme } from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import FriendItem from './../components/FriendItem';
import {AuthContext} from "../login/AuthContext";

export default function Friends({navigation}) {
    const {colors} = useTheme();
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
        <View style={styles.view}>
            <FlatList
                data={friends}
                renderItem={({item}) => {
                    const {email, full_name, avatar_url} = item;
                    return (
                        <FriendItem data={item} onPress={() => {
                            navigation.navigate('Chat', {email, full_name, avatar_url})
                        }}/>
                    );
                }}
                keyExtractor={item => item.email}
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

const styles = StyleSheet.create({
    container: {
        margin: 3
    },
    view: {
        flex: 1
    }
});
