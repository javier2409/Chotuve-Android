import { useTheme } from '@react-navigation/native';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import { Button, Divider, Icon, Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Thumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';
import Field from "../login/Field";
import {AuthContext} from "../login/AuthContext";
import * as firebase from "firebase";

export default function Upload() {
    const {colors} = useTheme();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [uploading, setUploading] = useState(false);
    const [user, server] = useContext(AuthContext);
    const [progress, setProgress] = useState(0);
    const video_ref = useRef({});
    const thumb_ref = useRef({});
    const uploadTask_video = useRef({});
    const uploadTask_thumb = useRef({});

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
        } catch (E) {
            console.log(E);
        }
    };

    async function uploadVideo(){
        setUploading(true);
        try {
            const {uri} = await Thumbnails.getThumbnailAsync(file.uri);

            /* Upload Thumbnail */
            const response_thumb = await fetch(uri);
            const blob_thumb = await response_thumb.blob();
            thumb_ref.current = firebase.storage().ref().child(`${user.email}/${title}_thumbnail`);
            thumb_ref.current.put(blob_thumb);

            /* Upload Video */
            const response_video = await fetch(file.uri);
            const blob = await response_video.blob();
            video_ref.current = firebase.storage().ref().child(`${user.email}/${title}`);
            const uploadTask_video = video_ref.current.put(blob);
            uploadTask_video.on(firebase.storage.TaskEvent.STATE_CHANGED, next, error, complete);

        } catch (error) {
            alert(error);
            setUploading(false);
        }
    }

    function next(snapshot){
        setProgress(snapshot.bytesTransferred/snapshot.totalBytes * 100);
    }
    function error(error){
        alert("Hubo un error, intenta nuevamente");
        setUploading(false);
    }
    async function complete(){
        await server.publishVideo({
            title: title,
            description: desc,
            thumbnail_uri: await thumb_ref.current.getDownloadURL(),
            video_uri: await video_ref.current.getDownloadURL()
        });
        setUploading(false);
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
                    useNativeControls
                />
                }
            </View>
            <View style={{...styles.block, ...{backgroundColor: colors.lighterbackground}}}>
                <Field label={'Título'} set={setTitle} />
                <Field label={'Descripción'} set={setDesc} multiline/>
            </View>
            <View style={styles.buttonview}>
                <Button
                    title='Publicar video'
                    buttonStyle={{...styles.button, backgroundColor: colors.primary}}
                    icon={{name:'file-upload', color: colors.text}}
                    disabled={uploading}
                    onPress={uploadVideo}
                />
                {uploading && <Text style={{...styles.uploadtext, color: colors.text}}>
                    {`Progreso de la carga: ${Math.trunc(progress)}%`}
                </Text>}
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
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    videoview: {
        alignItems: 'center'
    }
});
