import { useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Icon, Input, Text } from 'react-native-elements';

export default function ChatScreen({route, navigation}){
    const {colors} = useTheme();
    const {name, avatar_url} = route.params;
    navigation.setOptions({
        headerTitle: () => {
            return (
                <View style={styles.headerview}>
                    <Avatar source={{uri: avatar_url}} rounded/>
                    <Text style={{...styles.headertitle, ...{color: colors.title}}}>{name}</Text>
                </View>
            );
        }
    });
    return (
        <View style={styles.screenview}>
            <FlatList/>
            <View style={{...styles.messagebar, ...{backgroundColor: colors.primary}}}>
                <View style={{flex: 1}}>
                    <Input
                        placeholder= 'Mensaje' 
                        selectionColor= {colors.text}
                        inputStyle={{
                            color: colors.text
                        }}
                    />
                </View>
                <Icon 
                    name='send' 
                    color={colors.background} 
                    raised
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
        paddingLeft: 10
    },
    screenview: {
        justifyContent: 'flex-end',
        flex: 1
    }
});