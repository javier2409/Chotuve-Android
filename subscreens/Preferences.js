import React, {useCallback, useContext, useState} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import {Divider, ListItem, Text} from "react-native-elements";
import {useFocusEffect, useTheme} from "@react-navigation/native";
import {AuthContext} from "../login/AuthContext";

function Setting(props){
    const {colors} = useTheme();
    return(
        <ListItem
            containerStyle={{...styles.item, backgroundColor: colors.lighterbackground}}
            title={props.title}
            subtitle={props.subtitle}
            chevron
            titleStyle={{color: colors.text}}
            subtitleStyle={{color: colors.grey}}
            onPress={props.onPress}
        />
    )
}

export default function Preferences(){
    const {colors} = useTheme();
    const [user, server] = useContext(AuthContext);
    const [myInfo, setMyInfo] = useState({});

    function fetchUserData(){
        server.getMyInfo().then(
            info => {
                setMyInfo(info);
            },
            error => {
                console.log(error);
                setMyInfo({});
            }
        )
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    function changeName(new_name){
        server.changeDisplayName(new_name).then()
    }

    return (
        <ScrollView>
            <Text style={{...styles.title, color: colors.text}}>Perfil</Text>
            <View>
                <Divider/>
                <Setting title={"Nombre"} subtitle={myInfo.full_name}/>
                <Divider/>
                <Setting title={"Número Telefónico"} subtitle={myInfo.phone_number}/>
                <Divider/>
                <Setting title={"Dirección"} subtitle={myInfo.address}/>
                <Divider/>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create(
    {
        title: {
            margin: 20,
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center'
        }
    }
)