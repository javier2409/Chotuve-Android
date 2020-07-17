import React, {useContext, useState} from 'react';
import { ThemeContext } from '../Styles';
import VideoInfoForm from '../components/VideoInfoForm';
import { Button } from 'react-native-elements';
import { AuthContext } from '../utilities/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { ToastError } from '../utilities/ToastError';

export default function EditVideo({route, navigation}){
    const {video_id} = route.params;
    const {styles, colors} = useContext(ThemeContext);
    const [user, server] = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [isPrivate, setPrivate] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    function togglePrivate(){
        setPrivate(!isPrivate);
    }
    
    function saveChanges(){
        setUploading(true);
        server.modifyVideo(video_id, title, description, location, isPrivate).then(reset, ToastError);
    }

    function checkVideo(){
        return (
            (title.length < 100) &&
            (description.length < 500) &&
            (location.length < 200) &&
            (title.length > 0) &&
            (description.length > 0) &&
            (location.length > 0)
        )
    }

    useFocusEffect(React.useCallback(() => {
        server.getVideoInfo(video_id, true).then(result => {
            setTitle(result.title);
            setDescription(result.description);
            setLocation(result.location);
            setPrivate(result.is_private);
            setLoading(false);
        }, msg => {
            ToastError(msg);
            navigation.goBack();
        });
    }, []));

    function reset(){
        setUploading(false);
        navigation.goBack();
    }

    if (loading){
        return (
            <View style={styles.uploadContainer}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <View style={{...styles.container, flex: 1}} >
            <VideoInfoForm 
                setTitle={setTitle}
                setDesc={setDescription}
                setLocation={setLocation}
                initialTitle={title}
                initialDesc={description}
                initialLocation={location}
                checkBoxChecked={isPrivate}
                onTogglePrivate={togglePrivate}
            />
            <Button
                title='Guardar cambios'
                buttonStyle={styles.formButton}
                icon={{name:'file-upload', color: colors.text}}
                disabled={uploading || !checkVideo()}
                onPress={saveChanges}
            />
        </View>
    )
}