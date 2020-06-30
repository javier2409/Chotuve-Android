import React, {useCallback, useContext, useEffect, useState} from "react";
import {FlatList, ScrollView, View} from "react-native";
import {ListItem, Text, Button, Icon} from "react-native-elements";
import {ThemeContext} from "../Styles";
import {AuthContext} from "../utilities/AuthContext";
import {useFocusEffect} from "@react-navigation/native";

function FriendRequest(props){
    const [userData, setUserData] = useState({});
    const [photoURL, setPhotoURL] = useState(null);
    const [finished, setFinished] = useState(false);
    const [user, server] = useContext(AuthContext);
    const {styles, colors} = useContext(ThemeContext);
    const uuid = props.uuid;

    function fetchData(){
        server.getUserInfo(uuid).then(result => {
            setUserData(result);
            if (result.image_location) {
                server.getFirebaseDirectURL(result.image_location).then(setPhotoURL, null);
            }
        });
    }

    function answerRequest(answer){
        server.answerFriendRequest(uuid, answer).then(
            () => {
                setFinished(true);
            },
            () => {

            }
        );
    }

    useEffect(() => {
        fetchData();
    }, [uuid]);

    function rightButtons(){
        return (
            <View style={{flexDirection: 'row'}}>
                <Icon name={'check'} color={colors.text} onPress={() => {answerRequest(true)}}/>
                <Icon name={'close'} color={colors.text} onPress={() => {answerRequest(false)}}/>
            </View>
        )
    }

    if (finished) {
        return (
            <></>
        )
    }

    return (
        <View style={styles.friendItem}>
            <ListItem
                leftAvatar={{source: {uri: photoURL}}}
                containerStyle={{backgroundColor: colors.lighterbackground}}
                title={userData.display_name}
                titleStyle={{color: colors.text}}
                rightElement={rightButtons()}
            />
        </View>
    )
}

export default function Notifications(){
    const {styles} = useContext(ThemeContext);
    const [user, server] = useContext(AuthContext);
    const [friendRequests, setFriendRequests] = useState([]);

    function fetchFriendRequests(){
        server.getFriendRequests().then(result => {
            setFriendRequests(result);
        })
    }

    function fetchMessages(){

    }

    useFocusEffect(useCallback(() => {
        fetchFriendRequests();
    }, []))

    function renderFriendRequest({item}){
        return (
            <FriendRequest uuid={item.user_id}/>
        )
    }

    return(
        <View style={{...styles.container, ...styles.flexContainer}}>
            <Text style={styles.preferencesTitleView}>Solictudes de amistad</Text>
            <FlatList data={friendRequests} renderItem={renderFriendRequest} keyExtractor={item => item}/>
        </View>
    )
}