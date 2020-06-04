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
            labelStyle={{color: colors.grey}}
            inputStyle={{color: colors.grey}}
            containerStyle={styles.videoComment}
            secureTextEntry={props.secure}
            ref={props.reference}
            onChangeText={text => props.set(text)}
            onSubmitEditing={props.onSubmit}
            autoCompleteType={props.type}
            autoCapitalize={props.capitalize? 'words' : 'none'}
            multiline={props.multiline}
        />
    )
}
