import React, {useCallback, useContext, useRef, useState} from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import {Avatar, Divider, ListItem, colors, Text, Icon, Overlay} from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect } from "@react-navigation/native";
import {AuthContext} from "../login/AuthContext";
import {launchImageLibraryAsync, MediaTypeOptions} from "expo-image-picker";
import * as firebase from "firebase";

export default function UserProfile({route, navigation}){

    const {colors} = useTheme();
    const {email} = route.params;
    const [userData, setUserData] = useState({});
    const [localUserData, server] = useContext(AuthContext);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const profilePicture = useRef({});
    const [uploading, setUploading] = useState(false);

    navigation.setOptions({
        headerTitle: 'Perfil de ' + email
    });

    useFocusEffect(
        useCallback(
            () => {
                fetchUserData();
            }, [email]
        )
    );

    function fetchUserData(){
        server.getUserInfo(email).then(result => {
            setUserData(result);
            navigation.setOptions({
                headerTitle: 'Perfil de ' + result.full_name
            });
        }, () => {
            navigation.goBack();
        })
    }

    function toggleOverlay(){
        setOverlayVisible(!overlayVisible)
    }

    function addAsFriend(){
        server.addFriend(email).then(result => {
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
            const uri = await profilePicture.current.getDownloadURL();
            await server.changeProfilePicture(uri);
            setUserData(Object.assign(userData, {avatar_uri: uri}));
        } catch(error){
            alert('Hubo un error al cambiar la foto');
        }
        setUploading(false);
    }

    return (
        <ScrollView style={styles.general}>
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{height: 'auto'}}>
                <View>
                    {
                        (email === localUserData.email)
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
            <View style={styles.avatarview}>
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
                        source={{uri: userData.avatar_uri}}
                        onPress={
                            (email === localUserData.email)?
                                changeProfilePicture
                                :
                                null
                        }
                    />
                }
            </View>
            <Divider/>
            <View style={styles.nameview}>
                <ListItem
                    containerStyle={{backgroundColor: colors.lighterbackground}}
                    titleStyle={{color: colors.title}}
                    subtitleStyle={{color: colors.text}}
                    title='Nombre'
                    subtitle={userData.full_name}
                />
                <ListItem
                    containerStyle={{backgroundColor: colors.lighterbackground}}
                    titleStyle={{color: colors.title}}
                    subtitleStyle={{color: colors.text}}
                    title='Correo Electrónico'
                    subtitle={email}
                />
            </View>
            <Divider/>
            <View style={styles.videolist}>
                <Text style={{...styles.videolisttitle,...{color: colors.title}}}>Videos subidos</Text>
                <FlatList
                    horizontal
                    data={userData.videos}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity 
                                style={{...styles.videoview, ...{backgroundColor: colors.lighterbackground}}}
                                onPress={() => {
                                    navigation.navigate("Video", item)
                                }}>
                                <Image source={{uri: item.thumbnail_uri}} style={{height: 150, aspectRatio: 16/9}}/>
                                <Text style={{...styles.videotitle, ...{color: colors.title}}}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={item => item.id}
                    style={{alignSelf: 'flex-start'}}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    general: {
        flex:1,
    },
    avatarview: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    nameview: {
    },
    videolist: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    videoview: {
        margin :20,
        marginTop: 0,
    },
    videolisttitle:{
        fontSize: 18,
        fontWeight: 'bold',
        margin: 20
    },
    videotitle: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10
    }
})