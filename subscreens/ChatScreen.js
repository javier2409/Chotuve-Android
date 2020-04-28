import { useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Avatar, Icon, Input, Text } from 'react-native-elements';

const messages=[
    {
        name: 'Franco',
        msg: 'Hola, todo bien?'
    },
    {
        name: 'Javier',
        msg: 'Holaaa todo bien y vos?'
    },
    {
        name: 'Franco',
        msg: 'Viste esta nueva app Chotuve? Dicen que esta buenisima'
    },
];

export default function ChatScreen({route, navigation}){
    const {colors} = useTheme();
    const {name, avatar_url} = route.params;
    navigation.setOptions({
        headerTitle: () => {
            return (
                <TouchableOpacity 
                    style={styles.headerview}
                    onPress={() => {
                        navigation.navigate("UserProfile", {name});
                    }}
                >
                    <Avatar source={{uri: avatar_url}} rounded/>
                    <Text style={{...styles.headertitle, ...{color: colors.highlight}}}>{name}</Text>
                </TouchableOpacity>
            );
        }
    });
    return (
        <View style={styles.screenview}>
            <FlatList
                data={messages}
                renderItem={({item}) => {
                    return (
                        <View style={{
                            alignSelf: 
                                (item.name === name)
                                ? 'flex-start'
                                : 'flex-end',
                            padding: 10,
                            margin: 10,
                            backgroundColor: colors.lighterbackground,
                            maxWidth: '50%'
                        }}>
                            <Text style={{color: colors.text}}>
                                {item.msg}
                            </Text>
                        </View>
                    );
                }}
            />
            <View style={{...styles.messagebar}}>
                <View style={{...styles.inputview, ...{backgroundColor: colors.primary}}}>
                    <TextInput
                        placeholder= 'Mensaje' 
                        selectionColor= {colors.text}
                        style={{
                            color: colors.text
                        }}
                    />
                </View>
                <Icon 
                    name='send' 
                    color={colors.primary} 
                    raised
                    reverse
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
        fontSize: 22, 
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
    }
});