import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, View, FlatList, ScrollView } from "react-native"
import { useTheme } from '@react-navigation/native';
import { Video } from 'expo-av';
import {Divider, Icon, Input, Text} from 'react-native-elements';
import {AuthContext} from "../login/AuthContext";

export default function VideoScreen({route, navigation}){
    const {colors} = useTheme();
    const {id, video_url, title, author, description} = route.params;
	const [localUser, setLocalUser, server] = useContext(AuthContext);
	const [comments, setComments] = useState([]);
	const [myComment, setMyComment] = useState('');

	function sendComment(){
		server.publishComment({
			video_id: id,
			text: myComment
		}).then(() => {
			setMyComment('');
		})
	}

	function fetchComments(){
        server.getVideoComments(id).then(result => setComments(result));
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
        	fetchComments()
        })
    }, [navigation])

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
			<View style={{...styles.commentView}}>
				<View style={{flex:1}}>
					<Input
						inputStyle={{...styles.input, color: colors.text}}
						leftIcon={{name:'comment', color:colors.grey}}
						leftIconContainerStyle={{marginLeft:0, marginRight: 5}}
						containerStyle={{...styles.inputContainer}}
						placeholder={'Escribe un comentario...'}
						placeholderTextColor={colors.grey}
						underlineColorAndroid={colors.background}
						onChangeText={setMyComment}
					/>
				</View>
				<Icon name={'send'} color={colors.text} containerStyle={{margin:20}} onPress={sendComment}/>
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
					refreshing={false}
					onRefresh={fetchComments}
				/>
			</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
	    alignItems: 'stretch'
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
	},
	input: {
    	marginRight: 10
	},
	inputContainer: {
    	margin: 10,
		marginRight: 20
	},
	commentView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});
