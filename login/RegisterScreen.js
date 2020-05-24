import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AuthContext } from './AuthContext';
import {useContext, useState} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Field from './Field';

export default function RegisterScreen({navigation}){
    const {colors} = useTheme();
    const [email, setEmail] = React.useState(null);
    const [pwd1, setPwd1] = React.useState(null);
    const [pwd2, setPwd2] = React.useState(null);
    const [fullname, setFullname] = React.useState(null);
    const [userData, server] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    async function tryRegisterUser(){
        if (pwd1 !== pwd2){
            alert("Las contraseñas no coinciden.");
            return null;
        }

        setLoading(true);

        server.registerNewUser({
            email: email,
            password: pwd1,
            full_name: fullname
        }).then(
            () => {
                navigation.goBack();
            },
            reason => {
                alert(reason);
                setLoading(false);
            }
        )
    }

    if (loading) {
        return (
            <View style={{...styles.loadingview}}>
                <Text style={{fontSize: 22, color: colors.text}}>{'Espera...\n'}</Text>
                <ActivityIndicator size={60} color={colors.text} />
            </View>
        )
    }

    return(
        <ScrollView contentContainerStyle={{...styles.container, backgroundColor: colors.lighterbackground}}>
            <View style={styles.block}>
                <Text h4 style={{...styles.title, color: colors.title}}>Crear una nueva cuenta</Text>
                <ActivityIndicator color={colors.text} animating={loading}/>
            </View>
            <View style={{...styles.block, ...{backgroundColor: colors.background}}}>
                <Field label='Nombre y Apellido' icon='account-box' set={setFullname} type={'name'} capitalize />
                <Field label='Correo Electrónico' icon='mail' set={setEmail} type={'email'} />
                <Field label='Contraseña' icon='vpn-key' secure set={setPwd1} type={'password'} />
                <Field label='Repetir contraseña' icon='vpn-key' secure set={setPwd2} type={'password'} />
            </View>
            <View style={{...styles.buttonview}}>
                <Button
                    title='Registrar'
                    buttonStyle={{...styles.button, backgroundColor:colors.primary}}
                    icon={{name:'check-circle', color: colors.text}}
                    onPress={tryRegisterUser}
                    disabled={loading}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#242424',
      alignItems: 'stretch',
      justifyContent: 'center',
      padding: 10
    },
    block: {
      margin: 10,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 20
    },
    buttonview: {
      alignItems: 'stretch',
      justifyContent: 'center',
      margin: 15
    },
    button: {
      borderRadius: 20
    },
    title: {
      fontWeight: 'bold',
    },
    field: {
        margin: 8
    },
    loadingview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});  