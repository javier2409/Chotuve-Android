import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AuthContext } from '../utilities/AuthContext';
import {useContext, useState} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Field from './Field';
import {ThemeContext} from "../Styles";

export default function RegisterScreen({navigation}){
    const {styles, colors} = useContext(ThemeContext);
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
            <View style={styles.registerLoadingView}>
                <Text style={{fontSize: 22, color: colors.text}}>{'Espera...\n'}</Text>
                <ActivityIndicator size={60} color={colors.text} />
            </View>
        )
    }

    return(
        <ScrollView contentContainerStyle={{...styles.container, ...styles.flexContainer}}>
            <View style={styles.registerBlock}>
                <Text h4 style={styles.registerTitle}>Crear una nueva cuenta</Text>
                <ActivityIndicator color={colors.text} animating={loading}/>
            </View>
            <View style={styles.registerBlock}>
                <Field label='Nombre y Apellido' icon='account-box' set={setFullname} type={'name'} capitalize />
                <Field label='Correo Electrónico' icon='mail' set={setEmail} type={'email'} />
                <Field label='Contraseña' icon='vpn-key' secure set={setPwd1} type={'password'} />
                <Field label='Repetir contraseña' icon='vpn-key' secure set={setPwd2} type={'password'} />
            </View>
            <View style={styles.formButtonView}>
                <Button
                    title='Registrar'
                    buttonStyle={styles.formButton}
                    icon={{name:'check-circle', color: colors.highlight}}
                    onPress={tryRegisterUser}
                    disabled={loading}
                />
            </View>
        </ScrollView>
    )
}
