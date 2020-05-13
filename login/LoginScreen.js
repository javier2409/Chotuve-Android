import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text, Divider, Icon, Input, Image, SocialIcon } from 'react-native-elements';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

export default function LoginScreen({navigation}){
    navigation.setOptions({
        header: () => {return null}
    });

    const {colors} = useTheme();
    const [userData, setUserData] = useContext(AuthContext);

    return (
        <View style={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}>
        <View style={styles.block}>
            <Image 
                source={require('../assets/icon.png')} 
                style={{width:150, aspectRatio:1}}
                resizeMode='contain'
            />
        </View>
        <View style={{...styles.block, ...{backgroundColor: colors.background}}}>
            <Input 
                leftIcon={{name:'person', color:colors.grey}} 
                leftIconContainerStyle={{
                    marginRight: 10,
                    marginLeft: 0
                }}
                label='Nombre de Usuario' 
                inputStyle={{...styles.titleinput, ...{color: colors.grey}}} 
                selectionColor={colors.text} 
            />
            <Text> </Text>
            <Input 
                leftIcon={{name:'vpn-key', color:colors.grey}}
                leftIconContainerStyle={{
                    marginRight: 10,
                    marginLeft: 0
                }}
                label='Contraseña' 
                inputStyle={{...styles.descinput, ...{color: colors.grey}}} 
                secureTextEntry
            />
        </View>
        <View style={styles.buttonview}>
            <SocialIcon button type='facebook' title='Ingresar con Facebook'/>
            <SocialIcon button type='google' title='Ingresar con Google'/>
            <TouchableOpacity onPress={() => {navigation.navigate("Registro")}}>
              <Text style={{...styles.register, ...{color: colors.grey}}}>¿No tienes una cuenta? Regístrate aquí</Text>
            </TouchableOpacity>
        </View>
      </View>
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
    },
    button: {
      backgroundColor: '#ffffff'
    },
    filename: {
      alignSelf: 'center'
    },
    title: {
      fontWeight: 'bold',
      fontSize: 20
    },
    description: {
      fontWeight: 'bold',
      fontSize: 20
    },
    icon: {
      alignSelf: 'center'
    },
    uploadtext: {
      fontSize: 22,
      fontWeight: 'bold'
    },
    publishbtn: {
      margin: 30,
      padding: 15,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center'
    },
    register: {
        alignSelf: 'center',
        margin: 10,
        fontWeight: 'bold'
    }
});  