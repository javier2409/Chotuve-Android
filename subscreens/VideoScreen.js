import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity} from "react-native"
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import {Divider, Icon, Input, Text} from 'react-native-elements';
import {AuthContext} from "../login/AuthContext";
import * as Orientation from "expo-screen-orientation";
import {ThemeContext} from "../Styles";
import * as firebase from "firebase";

function Comment(props){
	const navigation = useNavigation();
	const {colors} = useContext(ThemeContext);
	const [authorName, setAuthorName] = useState(null);
	const [user, server] = useContext(AuthContext);

	function fetchName(){
		server.getUserName(props.author_uuid).then(result => {
			setAuthorName(result);
		})
	}

	useEffect(() => {
		fetchName();
	}, [props.author_uuid]);

	return (
		<>
			<Text
				style={{color:colors.title, fontWeight: 'bold'}}
				onPress={() => {
					navigation.navigate("UserProfile", {uid: props.author_uuid});
				}}
			>
				{authorName}
			</Text>
			<Text style={{color:colors.title}}>{props.text}</Text>
		</>
	)
}

export default function VideoScreen({route, navigation}){
    const {styles, colors} = useContext(ThemeContext);
    const {uuid, video_id, firebase_url, title, author, description} = route.params;
	const [userData, server] = useContext(AuthContext);
	const [comments, setComments] = useState([]);
	const [myComment, setMyComment] = useState('');
	const [sending, setSending] = useState(false);
	const [downloadURL, setDownloadURL] = useState(null);

	function sendComment(){
		if (myComment.length < 1){
			return
		}
		setSending(true);
		server.publishComment({
			video_id: video_id,
			text: myComment
		}).then(() => {
			setSending(false);
		})
		setMyComment('');
	}

	function fetchComments(){
        server.getVideoComments(video_id).then(result => setComments(result));
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
        	fetchComments();
	        firebase.storage().ref().child(firebase_url).getDownloadURL().then(url => {
		        setDownloadURL(url);
			});
        })
    }, [navigation])

	async function setOrientation(event){
		switch (event.fullscreenUpdate){
			case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
				await Orientation.lockAsync(Orientation.OrientationLock.ALL);
				break;
			case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
				await Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
				break;
		}
	}

    return (
        <View style={styles.videoContainer}>
			<Video
				style={styles.video}
				source={{uri: downloadURL}}
				useNativeControls
				shouldPlay
				resizeMode={Video.RESIZE_MODE_CONTAIN}
				onFullscreenUpdate={setOrientation}
			/>
			<Divider/>
			<View style={styles.videoInfo}>
				<Text style={{color:colors.title}}>
					<Text style={{fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
					<Text onPress={() => {
						navigation.navigate("UserProfile", {uid: uuid});
					}}> - {author}</Text>
				</Text>
				<Text style={{color:colors.title}}>{description}</Text>
			</View>
			<Divider/>
			<View style={styles.commentView}>
				<View style={{flex:1}}>
					{
						sending
							?
							<ActivityIndicator/>
							:
							<Input
								inputStyle={styles.videoCommentInput}
								leftIcon={{name:'comment', color:colors.grey}}
								leftIconContainerStyle={{marginLeft:0, marginRight: 5}}
								containerStyle={styles.inputContainer}
								placeholder={'Escribe un comentario...'}
								placeholderTextColor={colors.grey}
								underlineColorAndroid={colors.background}
								onChangeText={setMyComment}
								value={myComment}
							/>
					}
				</View>
				<Icon name={'send'} color={colors.background} containerStyle={{margin:0}} onPress={sendComment} raised reverse/>
			</View>
	        <Divider/>
			<View style={styles.commentList}>
				<FlatList 
					ListHeaderComponent={              
						<Text style={{color:colors.title, fontSize: 18, fontWeight: 'bold'}}>Comentarios</Text>
					}
					data={comments}
					renderItem={({item}) => {
						return (
							<View style={styles.videoComment}>
								<Comment author_uuid={item.uuid} text={item.text}/>
							</View>
						);
					}}
					keyExtractor={item => item.comment_id.toString()}
					refreshing={false}
					onRefresh={fetchComments}
				/>
			</View>
        </View>
    );
}
