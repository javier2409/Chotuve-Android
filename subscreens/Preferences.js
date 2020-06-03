import React from "react";
import {View} from "react-native";
import {ListItem, Text} from "react-native-elements";

export default function Preferences(){
    return (
        <View>
            <Text>Profile</Text>
            <View>
                <ListItem title={"Display name"} chevron/>
                <ListItem title={"Phone number"} chevron/>
                <ListItem title={"Address"} chevron/>
            </View>
            <Text>Application</Text>
            <View>
            </View>
        </View>
    )
};