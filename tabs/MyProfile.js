import React, {useContext} from 'react';
import { StyleSheet } from 'react-native';
import UserProfile from './../subscreens/UserProfile';
import {AuthContext} from "../utilities/AuthContext";

export default function MyProfile({navigation}) {

    const [userData, server] = useContext(AuthContext);

    return (
        <UserProfile
            route={{
                params: {
                    uid: userData.uuid
                }
            }}
            navigation={navigation}
        />
    );
}
