import { useTheme } from '@react-navigation/native';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Button, CheckBox, Icon, Text} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Thumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';
import Field from "../login/Field";
import {AuthContext} from "../utilities/AuthContext";
import * as firebase from "firebase";
import ProgressCircle from 'react-native-progress-circle';
import {ThemeContext} from "../Styles";
import VideoInfoForm from '../components/VideoInfoForm';

export default function Upload() {
    const {styles, colors} = useContext(ThemeContext);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [location, setLocation] = useState('');
    const [privateVideo, setPrivate] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, server] = useContext(AuthContext);
    const [progress, setProgress] = useState(0);
    const video_ref = useRef({});
    const thumb_ref = useRef({});
    const previewRef = useRef({});

    function checkVideo(){
        return (
            file && 
            (title.length > 0) && 
            (title.length < 100) &&
            (desc.length > 0) &&
            (desc.length < 500) &&
            (location.length > 0) &&
            (location.length < 200)
        )
    }

    function reset(){
        setFile(null);
        setTitle('');
        setDesc('');
        setProgress(0);
        setUploading(false);
    }

    async function pickImage(){
        try {
            setFile(null);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                aspect: [16, 9],
                quality: 1,
            });
            if (!result.cancelled) {
                setFile(result);
            }
        } catch (E) {
            console.log(E);
        }
    }

    function next(snapshot){
        setProgress(snapshot.bytesTransferred/snapshot.totalBytes * 100);
    }

    function errorHandler(error){
        alert("Hubo un error al subir el video, intenta nuevamente");
        reset();
    }

    async function complete(){
        try {
            await server.publishVideo({
                title: title,
                description: desc,
                thumbnail_uri: thumb_ref.current.fullPath,
                video_uri: video_ref.current.fullPath,
                location: location,
                is_private: privateVideo
            });
        } catch (error) {

        }
        reset();
    }

    async function uploadVideo(){
        if (!checkVideo()){
            return
        }
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
            uploadTask_video.on(firebase.storage.TaskEvent.STATE_CHANGED, next, errorHandler, complete);

        } catch (error) {
            alert(error);
            reset();
        }
    }

    function togglePrivate(){
        setPrivate(!privateVideo);
    }

    if (uploading) {
        return (
            <View style={styles.uploadContainer}>
                <Text h4 style={{color: colors.text}}>{'Tu video se está subiendo\n'}</Text>
                <ProgressCircle
                    percent={progress}
                    radius={60}
                    borderWidth={5}
                    color={colors.text}
                    bgColor={colors.background}
                >
                    <Text style={styles.percentText}>
                        {`${Math.trunc(progress)}%`}
                    </Text>
                </ProgressCircle>
            </View>
        );
    }

    return (
        <View style={styles.flexContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.uploadBlock}>
                    <Icon
                        name='attach-file'
                        containerStyle={styles.icon}
                        color={colors.primary}
                        size={40}
                        onPress={pickImage}
                        reverse
                    />
                    <Text style={{...styles.filename, ...{color: colors.text}}}>
                        {file? file.uri : 'Ningún archivo seleccionado'}
                    </Text>
                </View>
                <View style={styles.uploadVideoPreview}>
                    {file &&
                        <Video
                            style={{width: '90%', aspectRatio: file.width/file.height}}
                            resizeMode={Video.RESIZE_MODE_CONTAIN}
                            source={{uri: file.uri}}
                            shouldPlay
                            useNativeControls
                            ref={previewRef}
                        />
                    }
                </View>
                <VideoInfoForm 
                    setTitle={setTitle} 
                    setDesc={setDesc}
                    setLocation={setLocation}
                    title={title}
                    desc={desc}
                    location={location}
                    checkBoxChecked={privateVideo}
                    onTogglePrivate={togglePrivate}
                />
                <View style={styles.formButtonView}>
                    <Button
                        title='Publicar video'
                        buttonStyle={styles.formButton}
                        icon={{name:'file-upload', color: colors.text}}
                        disabled={uploading || !checkVideo()}
                        onPress={uploadVideo}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
