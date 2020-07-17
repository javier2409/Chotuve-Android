import React, {useContext} from 'react';
import {View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Field from "../login/Field";
import {ThemeContext} from "../Styles";

export default function VideoInfoForm(props){

    const {styles, colors} = useContext(ThemeContext);
    
    const setTitle = props.setTitle;
    const setDesc = props.setDesc;
    const setLocation = props.setLocation;
    const title = props.initialTitle;
    const desc = props.initialDesc;
    const location = props.initialLocation;
    const privateVideo = props.checkBoxChecked;
    const togglePrivate = props.onTogglePrivate;

    return (
        <View style={styles.uploadForm}>
            <Field label={'Título'} set={setTitle} initialValue={title} />
            <Field label={'Descripción'} set={setDesc} multiline initialValue={desc} />
            <Field label={'Ubicación'} set={setLocation} initialValue={location} />
            <CheckBox
                checked={privateVideo}
                title={'Sólo amigos'}
                onPress={togglePrivate}
                containerStyle={styles.uploadCheckBox}
                titleProps={{style: {color: colors.text}}}
                checkedColor={colors.primary}
                center={false}
            />
        </View>
    )
}