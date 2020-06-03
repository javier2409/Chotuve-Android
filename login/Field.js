import {useTheme} from "@react-navigation/native";
import {Input} from "react-native-elements";
import * as React from "react";
import {StyleSheet} from "react-native";
import {useContext} from "react";
import {ThemeContext} from "../Styles";

export default function Field(props){
    const {styles, colors} = useContext(ThemeContext);
    return(
        <Input
            leftIcon={{name:props.icon, color:colors.grey}}
            leftIconContainerStyle={{
                marginRight: 10,
                marginLeft: 0
            }}
            label={props.label}
            inputStyle={{color: colors.grey}}
            containerStyle={styles.videoComment}
            secureTextEntry={props.secure}
            ref={props.ref}
            onChangeText={text => props.set(text)}
            autoCompleteType={props.type}
            autoCapitalize={props.capitalize? 'words' : 'none'}
            multiline={props.multiline}
        />
    )
}
