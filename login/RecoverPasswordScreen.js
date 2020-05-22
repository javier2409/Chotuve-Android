import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useContext, useState } from 'react';
import {StyleSheet, View, ActivityIndicator, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-elements';
import { AuthContext } from './AuthContext';
import Field from "./Field";

export default function RecoverPasswordScreen(){
    const {colors} = useTheme();
    const [userData, server] = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [pwd1, setPwd1] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [loading, setLoading] = useState(false);

    function requestReset(){

    }

    function sendCodeAndPassword(){

    }

    return(
        <ScrollView contentContainerStyle={{...styles.container, backgroundColor: colors.lighterbackground}}>
            <View style={styles.block}>
                <Text style={{...styles.title, color: colors.title}}>{'Solicitar restablecimiento de' +
                ' contraseña\n'}</Text>
                <Text style={{...styles.text, color: colors.text}}>Te enviaremos un correo electrónico con un código que
                    deberas introducir para restablecer tu contraseña</Text>
                <ActivityIndicator color={colors.text} animating={loading}/>
            </View>
            <View style={{...styles.block, ...{backgroundColor: colors.background}}}>
                <Field label='Correo Electrónico' icon='mail' set={setEmail} type={'email'} />
            </View>
            <View style={{...styles.buttonview}}>
                <Button
                    title='Solicitar código de restauración'
                    buttonStyle={{...styles.button, backgroundColor:colors.primary}}
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
            <View style={{...styles.block, ...{backgroundColor: colors.background}}}>
                <Field label='Código' icon='confirmation-number' set={setEmail} type={'email'} />
                <Field label='Contraseña nueva' icon='vpn-key' set={setPwd1} secure type={'password'} />
                <Field label='Repetir contraseña nueva' icon='vpn-key' set={setPwd2} secure type={'password'} />
            </View>
            <View style={{...styles.buttonview}}>
                <Button
                    title='Restablecer contraseña'
                    buttonStyle={{...styles.button, backgroundColor:colors.primary}}
                    icon={{name:'check-circle', color: colors.text}}
                    onPress={sendCodeAndPassword}
                    disabled={loading}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
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
        textAlign: 'justify',
        fontSize: 20
    },
    field: {
        margin: 8
    },
    text: {
        textAlign: 'justify'
    }
});
