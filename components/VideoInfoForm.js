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
    const title = props.title;
    const desc = props.desc;
    const location = props.location;
    const privateVideo = props.checkBoxChecked;
    const togglePrivate = props.onTogglePrivate;

    return (
        <View style={styles.uploadForm}>
            <Field label={'Título'} set={setTitle} value={title} />
            <Field label={'Descripción'} set={setDesc} multiline value={desc} />
            <Field label={'Ubicación'} set={setLocation} value={location} />
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