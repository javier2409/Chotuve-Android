import React, {useContext} from 'react';
import { StyleSheet } from 'react-native';
import UserProfile from './../subscreens/UserProfile';
import {AuthContext} from "../login/AuthContext";

export default function MyProfile({navigation}) {

    const [userData, server] = useContext(AuthContext);

    return (
        <UserProfile
            route={{
                params: {
                    email: userData.email
                }
            }}
            navigation={navigation}
        />
    );
}

const styles = StyleSheet.create({
});
