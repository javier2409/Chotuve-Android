import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useContext, useRef, useState } from 'react';
import { ToastAndroid, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Image, Input, SocialIcon, Text } from 'react-native-elements';
import { AuthContext } from '../utilities/AuthContext';
import {ThemeContext} from "../Styles";
import Field from "./Field";

const alert = msg => {ToastAndroid.show(msg, ToastAndroid.LONG)};

export default function LoginScreen({navigation}){
    navigation.setOptions({
        header: () => {return null}
    });

    const {styles, colors} = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const [userData, server] = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [pass, setPass] = useState(null);

    function tryLoginWithUserAndPass(){
        setLoading(true);
        server.tryLogin(user, pass).then(null, (error) => {
            alert(error);
            setLoading(false);
        });
    }

    function tryFacebookLogin(){
        setLoading(true);
        server.tryFacebookLogin().then(null, (error) => {
            alert(error);
            setLoading(false);
        });
    }

    function tryGoogleLogin() {
        setLoading(true);
        server.tryGoogleLogin().then(null, (error) => {
            alert(error);
            setLoading(false);
        });
    }

    if (loading) {
        return (
            <View style={{...styles.uploadContainer, ...styles.flexContainer}}>
                <Text style={{fontSize: 22, color: colors.text}}>{'Iniciando sesión...\n'}</Text>
                <ActivityIndicator size={60} color={colors.text} />
            </View>
        )
    }

    return (
        <View style={{...styles.container, ...styles.flexContainer}}>
            <View style={styles.registerBlock}>
                <Image
                    source={require('../assets/icon.png')}
                    style={{width:150, aspectRatio:1}}
                    resizeMode='contain'
                />
            </View>
            <ActivityIndicator color={loading? colors.text : '#00000000'}/>
            <View style={styles.registerBlock}>
                <Field
                    icon={'person'}
                    label={'Email'}
                    set={setUser}
                    type={'email'}
                />
                <Field
                    icon={'vpn-key'}
                    label={'Contraseña'}
                    set={setPass}
                    type={'password'}
                    secure
                    onSubmit={tryLoginWithUserAndPass}
                />
            </View>
            <View style={styles.formButtonView}>
                <SocialIcon button type='facebook' title='Ingresar con Facebook' onPress={tryFacebookLogin}/>
                <SocialIcon button type='google' title='Ingresar con Google' onPress={tryGoogleLogin}/>
                <TouchableOpacity onPress={() => {navigation.navigate("Registro")}}>
                    <Text style={styles.loginRegisterButton}>¿No tienes una cuenta? Regístrate aquí</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {navigation.navigate("Restablecer contraseña")}}>
                    <Text style={styles.loginRegisterButton}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
