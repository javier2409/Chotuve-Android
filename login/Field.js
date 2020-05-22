import {useTheme} from "@react-navigation/native";
import {Input} from "react-native-elements";
import * as React from "react";
import {StyleSheet} from "react-native";

export default function Field(props){
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
            autoCompleteType={props.type}
            autoCapitalize={props.capitalize? 'words' : 'none'}
        />
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
