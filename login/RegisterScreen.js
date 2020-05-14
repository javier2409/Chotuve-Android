import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text, Divider, Icon, Input, Image, SocialIcon } from 'react-native-elements';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

function Field(props){
    const {colors} = useTheme();
    return(
        <Input 
            leftIcon={{name:props.icon, color:colors.grey}} 
            leftIconContainerStyle={{
                marginRight: 10,
                marginLeft: 0
            }}
            label={props.label}
            inputStyle={{...styles.input, ...{color: colors.grey}}} 
            containerStyle={{...styles.field}}
            selectionColor={colors.text} 
            secureTextEntry={props.secure}
            ref={props.ref}
            onChangeText={text => props.set(text)}
        />
    )
}

export default function RegisterScreen({navigation}){
    const {colors} = useTheme();
    const [user, setUser] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [pwd1, setPwd1] = React.useState(null);
    const [pwd2, setPwd2] = React.useState(null);
    const [fullname, setFullname] = React.useState(null);
    const [_a, _b, server] = useContext(AuthContext);

    async function tryRegisterUser(){
      const result = await server.registerNewUser({
        user: user,
        email: email,
        password: pwd1,
        full_name: fullname
      });
      if (result === 'success'){
        alert('Cuenta creada! Te hemos enviado un correo de verificación');
        navigation.goBack();
      } else {
        alert(result);
      }
    }

    return(
      <ScrollView contentContainerStyle={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}>
        <View style={styles.block}>
            <Text h4 style={{...styles.title, color: colors.title}}>Crear una nueva cuenta</Text>
        </View>
        <View style={{...styles.block, ...{backgroundColor: colors.background}}}>
            <Field label='Nombre de usuario' icon='person' set={setUser} />
            <Field label='Correo Electrónico' icon='mail' set={setEmail} />
            <Field label='Contraseña' icon='vpn-key' secure set={setPwd1} />
            <Field label='Repetir contraseña' icon='vpn-key' secure set={setPwd2} />
            <Field label='Nombre a mostrar' icon='account-box' set={setFullname} />
        </View>
        <View style={{...styles.buttonview}}>
            <Button
              title='Registrar' 
              buttonStyle={{...styles.button, backgroundColor:colors.primary}} 
              icon={{name:'check-circle', color: colors.text}}
              onPress={tryRegisterUser}
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
    }
});  