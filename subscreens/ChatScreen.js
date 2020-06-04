import { useTheme } from '@react-navigation/native';
import React, {useContext, useEffect, useState, useRef, useLayoutEffect} from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Avatar, Icon, Input, Text } from 'react-native-elements';
import {AuthContext} from "../login/AuthContext";
import hash from "react-native-web/dist/vendor/hash";
import {ThemeContext} from "../Styles";

export default function ChatScreen({route, navigation}){
    const {styles, colors} = useContext(ThemeContext);
    const {uid, email, full_name, avatar_url} = route.params;
    const [userData, server] = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [myMessage, setMyMessage] = useState('');
    const flatlist = useRef();

    function sendMessage(){
        const newMessage = {
            id: hash(email+myMessage+messages.length),
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
                    style={styles.chatHeaderView}
                    onPress={() => {
                        navigation.navigate("UserProfile", {uid});
                    }}
                >
                    <Avatar source={{uri: avatar_url}} rounded/>
                    <Text style={styles.chatHeaderTitle}>{full_name}</Text>
                </TouchableOpacity>
            );
        }
    });

    return (
        <View style={styles.chatView}>
            <View style={styles.chatMessageList}>
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
                                <Text style={styles.chatMessage}>
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
            <View style={styles.chatMessageBar}>
                <View style={styles.chatInputView}>
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
