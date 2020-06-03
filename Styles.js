import {AsyncStorage, StyleSheet} from "react-native";
import React, {createContext, useState} from "react";
import {colors} from "react-native-elements";

export const ThemeContext = createContext({});

export function ThemeContextProvider(props){

    const darkColors = {
        themeName: 'Dark',
        title: 'rgb(255,255,255)',
        primary: 'rgb(71,196,71)',
        background: 'rgb(0,0,0)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(240,245,240)',
        border: 'rgb(0,100,0)',
        lighterbackground: 'rgb(20,20,20)',
        highlight: 'rgb(200,255,200)',
        grey: 'rgb(100,100,100)'
    };

    const lightColors = {
        themeName: 'Light',
        title: 'rgb(0,0,0)',
        primary: 'rgb(71,196,71)',
        background: 'rgb(255,255,255)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(0,0,0)',
        border: 'rgb(0,100,0)',
        lighterbackground: 'rgb(243,243,243)',
        highlight: 'rgb(200,255,200)',
        grey: 'rgb(61,61,61)'
    };

    const [colors, setColors] = useState(darkColors);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            alignItems: 'stretch',
            justifyContent: 'center',
            padding: 10
        },
        uploadContainer: {
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10
        },
        flexContainer: {
            flex: 1,
            backgroundColor: colors.background
        },
        homeVideoItem: {
            marginVertical: 5,
            backgroundColor: colors.lighterbackground
        },
        homeVideoTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: 'bold'
        },
        homeVideoSubtitle: {
            color: colors.text,
            fontSize: 12,
        },
        homeFlatList: {
            backgroundColor: colors.background
        },
        uploadBlock: {
            margin: 10,
            padding: 20,
            alignItems: 'center'
        },
        uploadVideoPreview: {
            alignItems: 'center'
        },
        uploadForm: {
            margin: 10,
            padding: 10,
            alignItems: 'center',
            backgroundColor: colors.lighterbackground
        },
        formButtonView: {
            alignItems: 'stretch',
            justifyContent: 'center',
            margin: 15
        },
        formButton: {
            borderRadius: 20,
            margin: 10,
            backgroundColor: colors.primary
        },
        percentText: {
            fontSize: 18,
            color: colors.text
        },
        videoContainer: {
            flex: 1,
            alignItems: 'stretch',
            backgroundColor: colors.background
        },
        videoInfo: {
            padding: 10,
            justifyContent: 'space-between',
            backgroundColor: colors.lighterbackground
        },
        video: {
            width: '100%',
            aspectRatio: 16/9
        },
        videoComment: {
            margin:10
        },
        videoCommentInput: {
            marginRight: 10,
            color: colors.text
        },
        inputContainer: {
            margin: 10,
            marginRight: 20
        },
        commentView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        commentList: {
            flex: 1,
            padding: 10
        },
        profileAvatarView: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
        },
        profileVideoList: {
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        profileVideoView: {
            margin :20,
            marginTop: 0,
            backgroundColor: colors.lighterbackground
        },
        profileVideoListTitle:{
            fontSize: 18,
            fontWeight: 'bold',
            margin: 20,
            color: colors.title
        },
        profileVideoTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            margin: 10,
            color: colors.title
        },
        preferencesTitleView: {
            margin: 20,
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: colors.text
        },
        chatHeaderView: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        chatHeaderTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 10,
            color: colors.highlight
        },
        chatMessageBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            backgroundColor: '#00000000'
        },
        chatView: {
            justifyContent: 'flex-end',
            flex: 1,
            backgroundColor: colors.background
        },
        chatInputView: {
            flex: 1,
            borderRadius: 30,
            padding: 12,
            paddingLeft: 17,
            backgroundColor: colors.lighterbackground
        },
        chatMessageList: {
            flex: 1
        },
        chatMessage: {
            fontSize: 17,
            color: colors.text
        },
        registerBlock: {
            margin: 10,
            padding: 5,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderRadius: 20,
            backgroundColor: colors.background
        },
        registerLoadingView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        registerTitle: {
            fontWeight: 'bold',
            color: colors.title
        },
        paragraph: {
            textAlign: 'justify',
            color: colors.text
        },
        loginRegisterButton: {
            fontWeight: 'bold',
            color: colors.grey,
            alignSelf: 'center',
            margin: 3
        },
        noMarginContainer: {
            margin: 0
        },
        friendItem: {
            margin: 3
        },
        settingItemStyle: {
            marginVertical: 2,
            backgroundColor: colors.lighterbackground
        }
    });

    async function setLightMode(){
        setColors(lightColors);
        await AsyncStorage.setItem('THEME', 'light');
    }

    async function setDarkMode(){
        setColors(darkColors);
        await AsyncStorage.setItem('THEME', 'dark');
    }
    return(
        <ThemeContext.Provider value={{styles, colors, setLightMode, setDarkMode}}>
            {props.children}
        </ThemeContext.Provider>
    )

}
