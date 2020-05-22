import { useTheme } from '@react-navigation/native';
import React, {useContext, useEffect, useState, useRef, useLayoutEffect} from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Avatar, Icon, Input, Text } from 'react-native-elements';
import {AuthContext} from "../login/AuthContext";
import hash from "react-native-web/dist/vendor/hash";

export default function ChatScreen({route, navigation}){
    const {colors} = useTheme();
    const {email, full_name, avatar_url} = route.params;
    const [userData, server] = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [myMessage, setMyMessage] = useState('');
    const flatlist = useRef();

    function sendMessage(){
        const newMessage = {
            id: hash(name+myMessage+messages.length),
            email: userData.email,
            msg: myMessage
        }
        setMessages(messages.concat([newMessage]));
        setMyMessage('');
    }

    function fetchMessages(){
        server.getChatInfo(email).then(result => {
            setMessages(result)
        })
    }

    useEffect(() => {
        return navigation.addListener('focus', fetchMessages);
    }, [navigation])

    navigation.setOptions({
        headerTitle: () => {
            return (
                <TouchableOpacity 
                    style={styles.headerview}
                    onPress={() => {
                        navigation.navigate("UserProfile", {email});
                    }}
                >
                    <Avatar source={{uri: avatar_url}} rounded/>
                    <Text style={{...styles.headertitle, ...{color: colors.highlight}}}>{full_name}</Text>
                </TouchableOpacity>
            );
        }
    });

    return (
        <View style={styles.screenview}>
            <View style={styles.list}>
                <FlatList
                    data={messages}
                    renderItem={({item}) => {
                        return (
                            <View style={{
                                alignSelf:
                                    (item.email === email)
                                        ? 'flex-start'
                                        : 'flex-end',
                                padding: 10,
                                margin: 10,
                                backgroundColor: colors.lighterbackground,
                                maxWidth: '70%'
                            }}>
                                <Text style={{...styles.message, color: colors.text}}>
                                    {item.msg}
                                </Text>
                            </View>
                        );
                    }}
                    keyExtractor={item => item.id}
                    ref={flatlist}
                    onContentSizeChange={() => {
                        flatlist.current.scrollToEnd()
                    }}
                />
            </View>
            <View style={{...styles.messagebar}}>
                <View style={{...styles.inputview, ...{backgroundColor: colors.lighterbackground}}}>
                    <Input
                        placeholder= 'Escribe un mensaje...'
                        placeholderTextColor={colors.grey}
                        inputStyle={{ color: colors.text }}
                        inputContainerStyle={{borderBottomWidth: 0}}
                        onChangeText={setMyMessage}
                        value={myMessage}
                    />
                </View>
                <Icon 
                    name='send' 
                    color={colors.primary} 
                    raised
                    reverse
                    onPress={sendMessage}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerview: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headertitle: {
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold',
        marginLeft: 10
    },
    messagebar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: '#00000000'
    },
    screenview: {
        justifyContent: 'flex-end',
        flex: 1,
    },
    inputview: {
        flex: 1,
        borderRadius: 30,
        padding: 12,
        paddingLeft: 17
    },
    list: {
        flex: 1
    },
    message: {
        fontSize: 17
    }
});