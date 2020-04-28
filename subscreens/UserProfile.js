import React from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity } from "react-native";
import { Avatar, Divider, ListItem, colors, Text } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

const user={
    avatar_uri: 'xd',
    full_name: 'Javier Ferreyra',
    videos: [
        {
            title: 'Videazo',
            author: 'autorazo',
            description: 'Dale like y suscribete',
            thumbnail_uri: 'https://images.wallpaperscraft.com/image/city_vector_panorama_119914_3840x2160.jpg',
            video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            timestamp: '2020-04-28'
        },
        {
            title: 'Especial 1 suscriptor',
            author: 'autorazo',
            description: 'Dale like y suscribete',
            thumbnail_uri: 'https://images.wallpaperscraft.com/image/city_vector_panorama_119914_3840x2160.jpg',
            video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            timestamp: '2020-04-28'
        }
    ]
};

export default function UserProfile({route, navigation}){
    const {colors} = useTheme();
    const {name} = route.params;
    navigation.setOptions({
        headerTitle: 'Perfil de ' + name
    });
    return (
        <View style={styles.general}>
            <View style={styles.avatarview}>
                <Avatar rounded size={150} source={{uri: user.avatar_uri}}/>
            </View>
            <Divider/>
            <View style={styles.nameview}>
                <ListItem
                    containerStyle={{backgroundColor: colors.lighterbackground}}
                    titleStyle={{color: colors.title}}
                    subtitleStyle={{color: colors.text}}
                    title='Nick' 
                    subtitle={name}
                />
                <ListItem  
                    containerStyle={{backgroundColor: colors.lighterbackground}}
                    titleStyle={{color: colors.title}}
                    subtitleStyle={{color: colors.text}}
                    title='Nombre' 
                    subtitle={user.full_name}
                />
            </View>
            <Divider/>
            <View style={styles.videolist}>
                <Text style={{...styles.videolisttitle,...{color: colors.title}}}>Videos subidos</Text>
                <FlatList
                    horizontal
                    data={user.videos}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity 
                                style={{...styles.videoview, ...{backgroundColor: colors.lighterbackground}}}
                                onPress={() => {
                                    navigation.navigate("Video", item)
                                }}>
                                <Image source={{uri: item.thumbnail_uri}} style={{height: 150, aspectRatio: 16/9}}/>
                                <Text style={{...styles.videotitle, ...{color: colors.title}}}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    style={{alignSelf: 'flex-start'}}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    general: {
        flex:1,
    },
    avatarview: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    nameview: {
    },
    videolist: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    videoview: {
        margin :20,
        marginTop: 0,
    },
    videolisttitle:{
        fontSize: 18,
        fontWeight: 'bold',
        margin: 20
    },
    videotitle: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10
    }
})