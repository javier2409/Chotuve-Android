import { useTheme } from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import { Button, Divider, Icon, Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import Field from "../login/Field";
import {AuthContext} from "../login/AuthContext";

export default function Upload() {
    const {colors} = useTheme();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [uploading, setUploading] = useState(false);
    const [user, server] = useContext(AuthContext);

    async function pickImage(){
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });
            if (!result.cancelled) {
                setFile(result);
            }
            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    async function uploadVideo(){

    }

    return (
        <ScrollView contentContainerStyle={{...styles.container, ...{backgroundColor: colors.background}}}>
            <View style={styles.block}>
                <Icon name='attach-file' containerStyle={styles.icon} color={colors.primary} size={40} onPress={pickImage} reverse />
                <Text style={{...styles.filename, ...{color: colors.text}}}>
                    {file? file.uri : 'Ningún archivo seleccionado'}
                </Text>
            </View>
            <View style={{...styles.videoview}} >
                {file &&
                <Video
                    style={{width: '90%', aspectRatio: file.width/file.height}}
                    resizeMode={Video.RESIZE_MODE_CONTAIN}
                    source={{uri: file.uri}}
                    shouldPlay
                    isMuted
                    useNativeControls
                />
                }
            </View>
            <View style={{...styles.block, ...{backgroundColor: colors.lighterbackground}}}>
                <Field label={'Título'} />
                <Field label={'Descripción'} />
            </View>
            <View style={styles.buttonview}>
                <Button
                    title='Publicar video'
                    buttonStyle={{...styles.button, backgroundColor: colors.primary}}
                    icon={{name:'file-upload', color: colors.text}}
                    disabled={uploading}
                    onPress={uploadVideo}
                />
            </View>
        </ScrollView>
    );
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
        alignItems: 'center'
    },
    buttonview: {
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        margin: 10
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
    uploadtext: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    videoview: {
        alignItems: 'center'
    }
});
