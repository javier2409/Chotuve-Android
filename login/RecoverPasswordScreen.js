import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useContext, useState } from 'react';
import {StyleSheet, View, ActivityIndicator, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-elements';
import { AuthContext } from './AuthContext';
import Field from "./Field";
import {ThemeContext} from "../Styles";

export default function RecoverPasswordScreen({navigation}){
    const {styles, colors} = useContext(ThemeContext);
    const [userData, server] = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [pwd1, setPwd1] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [loading, setLoading] = useState(false);

    function requestReset(){
        setLoading(true);
        server.requestResetPasswordEmail(email).then(() => {
            alert("Hemos enviado el correo, revisa tu bandeja de entrada");
            setLoading(false);
        }, () => {
            alert("Hubo un error, revisa la dirección ingresada o intenta más tarde");
            setLoading(false);
        })
    }

    function sendCodeAndPassword(){
        setLoading(true);

        if (pwd1 !== pwd2){
            alert("Las contraseñas no coinciden");
            setLoading(false);
            return
        }

        if (pwd1.length < 6){
            alert("La contraseña no puede tener menos de 6 caracteres");
            setLoading(false);
            return
        }

        server.sendCodeAndNewPassword(code, pwd1).then(() => {
            alert("Contraseña actualizada con éxito");
            navigation.navigate("Ingreso");
        }, () => {
            alert("Hubo un error");
            setLoading(false);
        })
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.registerBlock}>
                <Text style={styles.registerTitle}>{'Solicitar restablecimiento de' +
                ' contraseña\n'}</Text>
                <Text style={styles.paragraph}>Te enviaremos un correo electrónico con un código que
                    deberas introducir para restablecer tu contraseña</Text>
                <ActivityIndicator color={colors.text} animating={loading}/>
            </View>
            <View style={styles.registerBlock}>
                <Field label='Correo Electrónico' icon='mail' set={setEmail} type={'email'} />
            </View>
            <View style={styles.formButtonView}>
                <Button
                    title='Solicitar código de restauración'
                    buttonStyle={styles.formButton}
                    icon={
                        loading?
                            <ActivityIndicator color={colors.text}/>
                            :
                            {name:'check-circle', color: colors.text}
                    }
                    onPress={requestReset}
                    disabled={loading}
                />
            </View>
            <View style={styles.registerBlock}>
                <Field label='Código' icon='confirmation-number' set={setCode} type={'email'} />
                <Field label='Contraseña nueva' icon='vpn-key' set={setPwd1} secure type={'password'} />
                <Field label='Repetir contraseña nueva' icon='vpn-key' set={setPwd2} secure type={'password'} />
            </View>
            <View style={styles.formButtonView}>
                <Button
                    title='Restablecer contraseña'
                    buttonStyle={styles.formButton}
                    icon={{name:'check-circle', color: colors.text}}
                    onPress={sendCodeAndPassword}
                    disabled={loading}
                />
            </View>
        </ScrollView>
    )
}
