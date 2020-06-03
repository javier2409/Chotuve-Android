import React, {useCallback, useContext, useState} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import {Button, Divider, Input, ListItem, Overlay, Text} from "react-native-elements";
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

function SettingOverlay(props){
    return (
        <Overlay isVisible={props.visible} onBackdropPress={props.onBackdropPress} overlayStyle={{height: 'auto'}}>
            <Input onChangeText={props.onChangeText} value={props.value}/>
        </Overlay>
    )
}

export default function Preferences(){
    const {colors} = useTheme();
    const [user, server] = useContext(AuthContext);
    const [nameOverlayVisible, setNameOverlayVisible] = useState(false);
    const [numberOverlayVisible, setNumberOverlayVisible] = useState(false);
    const [addressOverlayVisible, setAddressOverlayVisible] = useState(false);
    const [name, setName] = useState(null);
    const [number, setNumber] = useState(null);
    const [address, setAddress] = useState(null);
    const [sending, setSending] = useState(false);

    function fetchUserData(){
        server.getMyInfo().then(
            info => {
                setName(info.full_name);
                setNumber(info.phone_number);
                setAddress(info.address);
            },
            error => {
                console.log(error);
            }
        )
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    async function sendUserData(){
        setSending(true);
        try{
            await server.changeMyUserData({
                full_name: name,
                phone_number: number,
                address: address
            })
        } catch(error) {
            console.log(error);
            alert("Hubo un error al actualizar la información.")
        }
        setSending(false);
    }

    function toggleNameEdit(){
        setNameOverlayVisible(!nameOverlayVisible);
    }

    function toggleNumberEdit(){
        setNumberOverlayVisible(!numberOverlayVisible);
    }

    function toggleAddressEdit(){
        setAddressOverlayVisible(!addressOverlayVisible);
    }

    return (
        <ScrollView>
            <Text style={{...styles.title, color: colors.text}}>Perfil</Text>
            <SettingOverlay visible={nameOverlayVisible} onBackdropPress={toggleNameEdit} onChangeText={setName} value={name} />
            <SettingOverlay visible={numberOverlayVisible} onBackdropPress={toggleNumberEdit} onChangeText={setNumber} value={number} />
            <SettingOverlay visible={addressOverlayVisible} onBackdropPress={toggleAddressEdit} onChangeText={setAddress} value={address} />
            <View>
                <Divider/>
                <Setting title={"Nombre"} subtitle={name} onPress={toggleNameEdit}/>
                <Divider/>
                <Setting title={"Número Telefónico"} subtitle={number} onPress={toggleNumberEdit}/>
                <Divider/>
                <Setting title={"Dirección"} subtitle={address} onPress={toggleAddressEdit}/>
                <Divider/>
            </View>
            <Button
                title='Guardar cambios'
                buttonStyle={{...styles.button, backgroundColor:colors.primary}}
                icon={{name:'check-circle', color: colors.text}}
                onPress={sendUserData}
                disabled={sending}
            />
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    title: {
        margin: 20,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    button: {
        alignSelf: 'stretch',
        borderRadius: 20,
        margin: 20
    }
});
