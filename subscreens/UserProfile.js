import React, {useCallback, useContext, useRef, useState} from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import {Avatar, Divider, ListItem, colors, Text, Icon, Overlay} from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect } from "@react-navigation/native";
import {AuthContext} from "../login/AuthContext";
import {launchImageLibraryAsync, MediaTypeOptions} from "expo-image-picker";
import * as firebase from "firebase";
import {ThemeContext} from "../Styles";
import VideoItem from "../components/VideoItem";

export default function UserProfile({route, navigation}){

    const {styles, colors} = useContext(ThemeContext);
    const {uid} = route.params;
    const [userData, setUserData] = useState({});
    const [localUserData, server] = useContext(AuthContext);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const profilePicture = useRef({});
    const [uploading, setUploading] = useState(false);
    const [avatar, setAvatar] = useState(null);

    function fetchUserData(){
        server.getUserInfo(uid).then(result => {
            if (result.image_location){
                firebase.storage().ref().child(result.image_location).getDownloadURL().then(url => {
                    setAvatar(url);
                });
            }
            setUserData(result);
            navigation.setOptions({
                headerTitle: 'Perfil de ' + result.display_name
            });
        }, () => {
            navigation.goBack();
        })
    }

    useFocusEffect(
        useCallback(
            () => {
                fetchUserData();
            }, []
        )
    );

    function toggleOverlay(){
        setOverlayVisible(!overlayVisible)
    }

    function addAsFriend(){
        server.addFriend(uid).then(result => {
            setOverlayVisible(false);
        });
    }

    function goToPreferences(){
        toggleOverlay();
        navigation.navigate("Preferencias");
    }

    function logOut(){
        server.logOut();
    }

    async function changeProfilePicture(){
        try {
            const {cancelled, uri} = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1
            })
            if (!cancelled) {
                setUploading(true);
                const image = await fetch(uri);
                const blob = await image.blob();
                profilePicture.current = firebase.storage().ref().child(`${localUserData.email}/profile/profile_picture.jpeg`);
                const uploadTask = profilePicture.current.put(blob);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, complete);
            }
        } catch (error){
            alert("Hubo un error");
            setUploading(false);
        }
    }

    async function complete(){
        try {
            const uri = profilePicture.current.fullPath;
            await server.changeProfilePicture(uri);
            setUserData(Object.assign(userData, {avatar_uri: uri}));
        } catch(error){
            alert('Hubo un error al cambiar la foto');
        }
        setUploading(false);
    }

    return (
        <ScrollView style={styles.flexContainer}>
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{height: 'auto'}}>
                <View>
                    {
                        (uid === localUserData.uuid)
                            ?
                            <View>
                                <ListItem title='Preferencias' leftIcon={{name:'settings'}} chevron onPress={goToPreferences} />
                                <ListItem title='Salir' leftIcon={{name:'exit-to-app'}} onPress={logOut}/>
                            </View>
                            :
                            <View>
                                <ListItem
                                    title='Añadir como amigo'
                                    leftIcon={{name:'person'}}
                                    disabled={userData.friends}
                                    disabledStyle={{opacity: 0.3}}
                                    onPress={addAsFriend}
                                />
                            </View>
                    }
                </View>
            </Overlay>
            <View style={styles.profileAvatarView}>
                <Icon
                    name='more-vert'
                    color={colors.text}
                    containerStyle={{alignSelf: 'flex-end'}}
                    onPress={toggleOverlay}
                />
                {uploading? <ActivityIndicator/> :
                    <Avatar
                        rounded
                        size={150}
                        source={{uri: avatar}}
                        onPress={
                            (uid === localUserData.uuid)?
                                changeProfilePicture
                                :
                                null
                        }
                    />
                }
            </View>
            <Divider/>
            <View>
                <ListItem
                    containerStyle={{backgroundColor: colors.lighterbackground}}
                    titleStyle={{color: colors.title}}
                    subtitleStyle={{color: colors.text}}
                    title='Nombre'
                    subtitle={userData.display_name}
                />
                <ListItem
                    containerStyle={{backgroundColor: colors.lighterbackground}}
                    titleStyle={{color: colors.title}}
                    subtitleStyle={{color: colors.text}}
                    title='Correo Electrónico'
                    subtitle={userData.email}
                />
            </View>
            <Divider/>
            <View style={styles.profileVideoList}>
                <Text style={{...styles.profileVideoListTitle}}>Videos subidos</Text>
                <FlatList
                    horizontal
                    data={userData.videos}
                    renderItem={({item}) => {
                        return (
                            <View style={{width: 200, height:'auto', marginHorizontal: 20}}>
                                <VideoItem videoData={item}/>
                            </View>
                        );
                    }}
                    keyExtractor={item => toString(item.video_id)}
                    style={{alignSelf: 'flex-start'}}
                />
            </View>
        </ScrollView>
    );
}
