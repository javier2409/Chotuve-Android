import React, {useCallback, useContext, useRef, useState} from 'react';
import { View, ToastAndroid, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Share } from "react-native";
import {Avatar, Divider, ListItem, colors, Text, Icon, Overlay} from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect } from "@react-navigation/native";
import {AuthContext} from "../utilities/AuthContext";
import {launchImageLibraryAsync, MediaTypeOptions} from "expo-image-picker";
import * as firebase from "firebase";
import {ThemeContext} from "../Styles";
import VideoItem from "../components/VideoItem";
import OverlayMenuItem from "../components/OverlayMenuItem";
import { ServerProxy } from '../utilities/ServerProxy';
import { ToastError } from '../utilities/ToastError';

const alert = msg => {ToastAndroid.show(msg, ToastAndroid.LONG)};

function ProfileInfoItem(props){

    const {colors} = useContext(ThemeContext);

    if (props.subtitle){
        return (
            <ListItem
                containerStyle={{backgroundColor: colors.lighterbackground}}
                titleStyle={{color: colors.title}}
                subtitleStyle={{color: colors.text}}
                title={props.title}
                subtitle={props.subtitle}
            />
        )
    } else {
        return (
            <></>
        )
    }

}

export default function UserProfile({route, navigation}){

    const {styles, colors} = useContext(ThemeContext);
    const {uid} = route.params;
    const [userData, setUserData] = useState({});
    const [userVideos, setUserVideos] = useState([]);
    const [localUserData, server] = useContext(AuthContext);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const profilePicture = useRef({});
    const [uploading, setUploading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [friendship, setFriendship] = useState('');


    function fetchUserData(force = false){
        if (force){
            setUserVideos([]);
        }
        setRefreshing(true);
        server.getUserInfo(uid, force).then(result => {
            if (result.image_location){
                server.getFirebaseDirectURL(result.image_location).then(url => {
                    setAvatar(url);
                });
            }
            server.getUserVideos(uid, force).then(result => {
                setUserVideos(result);
            }, ToastError);
            setUserData(result);
            setFriendship(result.friendship_status);
            setRefreshing(false);
            navigation.setOptions({
                headerTitle: 'Perfil de ' + result.display_name
            });
        }, errmsg => {
            ToastError(errmsg);
        });
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
            setFriendship("pending");
        }, ToastError);
    }

    function deleteFriend(){
        server.deleteFriend(uid).then(result => {
            setOverlayVisible(false);
            setFriendship("unknown");
        })
    }

    function cancelFriendRequest(){
        //NOT IMPLEMENTED IN APPSERVER
    }

    function goToPreferences(){
        toggleOverlay();
        navigation.navigate("Preferencias");
    }

    function logOut(){
        server.logOut().then();
    }

    async function shareScreen() {
		try {
			const url = "https://chotuve.video/users/" + uid;
		  	const result = await Share.share({
				message:
			  	"Mira este usuario! " + url,
		  	});
		  	// if (result.action === Share.sharedAction) {
			// 	if (result.activityType) {
			//   	// shared with activity type of result.activityType
			// 	} else {
			//   	// shared
			// 	}
		  	// } else if (result.action === Share.dismissedAction) {
			// 	// dismissed
		  	// }
		} catch (error) {
		  	alert(error.message);
		}
	};

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
            const path = profilePicture.current.fullPath;
            await server.changeProfilePicture(path);
            const uri = await server.getFirebaseDirectURL(path);
            setAvatar(uri);
        } catch(error){
            ToastError(error);
        }
        setUploading(false);
    }

    return (
        <ScrollView 
            style={styles.flexContainer}
            refreshControl={
                <RefreshControl onRefresh={() => {fetchUserData(true)}} refreshing={refreshing}/>
            }
        >
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{height: 'auto'}}>
                <View>
                    <OverlayMenuItem
                        title={'Preferencias'}
                        icon={'settings'}
                        chevron
                        onPress={goToPreferences}
                        visible={uid === localUserData.uuid}
                    />
                    <OverlayMenuItem
                        title={'Salir'}
                        icon={'exit-to-app'}
                        onPress={logOut}
                        visible={uid === localUserData.uuid}
                    />
                    <OverlayMenuItem
                        title={'Añadir como amigo'}
                        icon={'person-add'}
                        onPress={addAsFriend}
                        visible={
                            (friendship === 'unknown') && 
                            (uid !== localUserData.uuid)
                        }
                    />
                    <OverlayMenuItem
                        title={'Eliminar amigo'}
                        icon={'person-outline'}
                        onPress={deleteFriend}
                        visible={friendship === 'accepted'}
                    />
                    <OverlayMenuItem
                        title={'Solicitud de amistad enviada'}
                        icon={'person-add'}
                        onPress={() => {}}
                        visible={friendship === 'pending'}
                        disabled
                    />
                </View>
            </Overlay>
            <View style={styles.profileAvatarView}>
                <View style={{ flexDirection: 'row', alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Icon
                        name="share"
                        color={colors.text}
                        containerStyle={{alignSelf: 'flex-start'}}
                        onPress={shareScreen}
                    />
                    <Icon
                        name='more-vert'
                        color={colors.text}
                        containerStyle={{alignSelf: 'flex-end'}}
                        onPress={toggleOverlay}
                    />
                </View>
                {uploading? <ActivityIndicator/> :
                    <Avatar
                        rounded
                        size={150}
                        source={{uri: avatar}}
                        containerStyle={{ alignSelf: 'center' }}
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
                <ProfileInfoItem title={'Nombre'} subtitle={userData.display_name}/>
                <ProfileInfoItem title={'Correo electrónico'} subtitle={userData.email}/>
                <ProfileInfoItem title={'Teléfono'} subtitle={userData.phone_number}/>
            </View>
            <Divider/>
            <View style={styles.profileVideoList}>
                <Text style={{...styles.profileVideoListTitle}}>Videos subidos</Text>
                <FlatList
                    horizontal
                    data={userVideos}
                    renderItem={({item}) => {
                        return (
                            <View style={{width: 200, height:'auto', marginHorizontal: 20}}>
                                <VideoItem video_id={item.video_id} hideAuthor shouldHavePreview={false}/>
                            </View>
                        );
                    }}
                    keyExtractor={item => item.video_id.toString()}
                    style={{alignSelf: 'flex-start'}}
                />
            </View>
        </ScrollView>
    );
}
