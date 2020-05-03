import React from 'react';
import { StyleSheet, View, FlatList, ScrollView } from "react-native"
import { useTheme } from '@react-navigation/native';
import { Video } from 'expo-av';
import { Divider, Text } from 'react-native-elements';

let comments = [];
for (let i=0; i<30; i++){
	comments.push({
		id: i.toString(),
		author: 'SomeGuy '+i,
		text: 'Hola soy el comentario '+i,
	})
}

export default function VideoScreen({route}){
    const {colors} = useTheme();
    const {video_url, title, author, description} = route.params;
    return (
        <View style={{...styles.container, ...{backgroundColor: colors.background}}}>
			<Video
				style={styles.video}
				source={{uri: video_url}}
				useNativeControls
				shouldPlay
				resizeMode={Video.RESIZE_MODE_CONTAIN}
			/>
			<Divider/>
			<View style={{...styles.videoInfo,...{backgroundColor: colors.lighterbackground}}}>
				<Text style={{color:colors.title}}>
					<Text style={{fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
					<Text> - {author}</Text>
				</Text>
				<Text style={{color:colors.title}}>{description}</Text>
			</View>
			<Divider/>
			<View style={styles.videoInfo}>
				<FlatList 
					ListHeaderComponent={              
						<Text style={{color:colors.title, fontSize: 18, fontWeight: 'bold'}}>Comentarios</Text>
					}
					data={comments}
					renderItem={({item}) => {
						return (
							<View style={styles.comment}>
								<Text style={{color:colors.title, fontWeight: 'bold'}}>{item.author}</Text>
								<Text style={{color:colors.title}}>{item.text}</Text>
							</View>
						);
					}}
					keyExtractor={item => item.id}
				/>
			</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
		flex: 1
    },
    videoInfo: {
		padding: 10,
		justifyContent: 'space-between',
    },
    video: {
		width: '100%',
		aspectRatio: 16/9
	},
	comment: {
		margin:10
	}
});
