import { useFocusEffect } from '@react-navigation/native';
import React, {useContext, useEffect, useState, useRef, useCallback} from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { Avatar, Icon, Input, Text } from 'react-native-elements';
import {AuthContext} from "../utilities/AuthContext";
import hash from "react-native-web/dist/vendor/hash";
import {ThemeContext} from "../Styles";
import {Notifications} from "expo";
import { ToastError } from '../utilities/ToastError';

export default function ChatScreen({route, navigation}){
    const uid = route.params.uid;
    
    const {styles, colors} = useContext(ThemeContext);
    const [userData, server] = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [myMessage, setMyMessage] = useState('');
    const [fullName, setFullName] = useState(null);
    const [email, setEmail] = useState(null);
    const [avatarURL, setAvatarURL] = useState(null);

    const flatlist = useRef();

    function sendMessage(){
        const sendableMessage = myMessage;
        setMyMessage('');
        if (myMessage.length < 1){
            return;
        }
        const newMessage = {
            id: hash(email+sendableMessage+messages.length),
            sender_id: userData.uuid,
            text: sendableMessage
        }
        server.sendMessage(sendableMessage, uid).then(() => {
            setMessages(messages.concat([newMessage]));
        }, ToastError);
    }

    function fetchMessages(){
        server.getChatInfo(uid).then(result => {
            setMessages(result)
        }, ToastError);
        server.getUserInfo(uid).then(result => {
            setFullName(result.display_name);
            setEmail(result.email);
            if (result.image_location){
                server.getFirebaseDirectURL(result.image_location).then(setAvatarURL, null);
            }
        }, ToastError); 
    }

    useFocusEffect(useCallback(() => {
        return navigation.addListener('focus', fetchMessages);
    }))

    useEffect(() => {
       const subscription = Notifications.addListener(async (notification) => {
           const data = notification.data;
           if (data.type === 'message' && data.uuid === uid){
               Notifications.dismissNotificationAsync(notification.notificationId).then(null);
               const newMessage = {
                   id: data.id,
                   sender_id: data.uuid,
                   text: data.msg
               }
               setMessages(messages.concat([newMessage]));
           }
       });
       return () => subscription.remove();
    });

    navigation.setOptions({
        headerTitle: () => {
            return (
                <TouchableOpacity 
                    style={styles.chatHeaderView}
                    onPress={() => {
                        navigation.navigate("UserProfile", {uid});
                    }}
                >
                    <Avatar source={{uri: avatarURL}} rounded/>
                    <Text style={styles.chatHeaderTitle}>{fullName}</Text>
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
                                    (item.sender_id === userData.uuid)
                                        ? 'flex-end'
                                        : 'flex-start',
                                padding: 10,
                                margin: 10,
                                backgroundColor:
                                    (item.sender_id === userData.uuid)
                                        ?   colors.primary
                                        :   colors.lighterbackground,
                                maxWidth: '70%',
                                borderRadius: 10
                            }}>
                                <Text style={styles.chatMessage}>
                                    {item.text}
                                </Text>
                            </View>
                        );
                    }}
                    keyExtractor={item => item.id.toString()}
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
