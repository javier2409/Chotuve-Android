import * as React from 'react';
import {ListItem} from 'react-native-elements'

export default function OverlayMenuItem(props){

    if (!props.visible){
        return <></>
    }

    return (
        <ListItem
            title={props.title}
            leftIcon={{name:props.icon}}
            onPress={props.onPress}
            chevron={props.chevron}
        />
    )
}