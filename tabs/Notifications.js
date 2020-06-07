import React, {useCallback, useContext, useState} from "react";
import {ScrollView, View} from "react-native";
import {Text} from "react-native-elements";
import {ThemeContext} from "../Styles";
import {AuthContext} from "../login/AuthContext";
import {useFocusEffect} from "@react-navigation/native";

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

    return(
        <View>
            <ScrollView>
                <Text style={styles.preferencesTitleView}>Solictudes de amistad</Text>
                <Text style={styles.preferencesTitleView}>Mensajes</Text>
            </ScrollView>
        </View>
    )
}