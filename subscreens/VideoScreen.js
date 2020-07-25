import React, {useContext, useEffect, useState, useCallback} from 'react';
import {View, FlatList, ActivityIndicator, Share} from "react-native"
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import {Divider, Icon, Input, Text, CheckBox} from 'react-native-elements';
import {AuthContext} from "../utilities/AuthContext";
import * as Orientation from "expo-screen-orientation";
import {ThemeContext} from "../Styles";
import { Overlay } from 'react-native-elements';
import OverlayMenuItem from "../components/OverlayMenuItem";
import LoadingView from '../components/LoadingView';
import {ToastError} from '../utilities/ToastError';

function getMinute(milliseconds){
	const seconds = ~~(milliseconds/1000)
	const minute = ~~(seconds/60)
	const remaining_seconds = seconds % 60
	return ("00"+minute).slice(-2)+":"+("00"+remaining_seconds).slice(-2);
}

function Comment(props){
	const navigation = useNavigation();
	const {colors} = useContext(ThemeContext);
	const [user, server] = useContext(AuthContext);

	const [authorName, setAuthorName] = useState('');

	useEffect(() => {
		server.getUserName(props.author_uuid).then(setAuthorName);
	}, [props.author_uuid]);

	if (props.commentTime && (props.videoTime < props.commentTime)){
		return <></>
	}

	return (
		<>
			<Text>
				<Text
					style={{color:colors.title, fontWeight: 'bold'}}
					onPress={() => {
						navigation.navigate("UserProfile", {uid: props.author_uuid});
					}}
				>
					{authorName}
				</Text>
				{"  "}
				<Text style={{color: colors.grey, marginHorizontal: 10}}>
					{props.commentTime ? getMinute(props.commentTime) : ""}
				</Text>
			</Text>
			<Text style={{color:colors.title}}>{props.text}</Text>
		</>
	)
}

function VideoInfo(props){
	const [videoLikes, setLikes] = useState(props.likes);
	const [videoDislikes, setDislikes] = useState(props.dislikes);
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [user, server] = useContext(AuthContext);
	const {colors, styles} = useContext(ThemeContext);
	const navigation = useNavigation();

	const video_id = props.videoId;
	const uuid = props.authorUid;
	const author = props.authorName;
	const description = props.description;
	const title = props.title;
	const initialReaction = props.myReaction;
	const location = props.location;

	const [myReaction, setMyReaction] = useState(initialReaction);

	function updateReaction(reaction){
		if (reaction === 'like'){
			setDislikes(videoDislikes - (myReaction === 'dislike'))
			setLikes(videoLikes + (myReaction !== 'like'));
			setMyReaction('like');
		} else {
			setLikes(videoLikes - (myReaction === 'like'))
			setDislikes(videoDislikes + (myReaction !== 'dislike'));
			setMyReaction('dislike');
		}
	}

	function react(reaction){
		const oldReaction = myReaction;
		setMyReaction(reaction);
		if (oldReaction === 'none'){
			server.reactToVideo(reaction, video_id).then(
				() => {
					updateReaction(reaction);
				},
				() => {
					setMyReaction(oldReaction);
				}
			)	
		} else {
			server.changeVideoReaction(reaction, video_id).then(
				() => {
					updateReaction(reaction);
				},
				() => {
					setMyReaction(oldReaction);
				}
			)
		}
	}

	function toggleOverlay(){
		setOverlayVisible(!overlayVisible);
	}

	navigation.setOptions({
		headerRight: () => {
			if (uuid !== user.uuid){
				return (
					<Icon
					name="share"
					containerStyle={styles.videoComment}
					color={colors.text}
					onPress={shareScreen}
					/>
				)
			}

			return (
				<View style={{ flexDirection: 'row' }}>
				<Icon
					name="share"
					containerStyle={styles.videoComment}
					color={colors.text}
					onPress={shareScreen}
				/>
				<Icon 
					name='more-vert' 
					containerStyle={styles.videoComment} 
					color={colors.text}
					onPress={toggleOverlay}
				/>
				</View>
			)
		}
	})

	function deleteVideo(){
		server.deleteVideo(video_id).then(() => {
			navigation.goBack();
		}, ToastError);
	}

	function editVideo(){
		toggleOverlay();
		navigation.navigate("Edit Video", {video_id});
	}

	async function shareScreen() {
		try {
			const url = "https://chotuve.video/videos/" + video_id;
		  	const result = await Share.share({
				message:
			  	"Mira este video! " + url,
		  	});
		  	// if (result.action === Share.sharedAction) {
			// 	if (result.activityType) {
			//   	// shared with activity type of result.activityType
			// 	} else {
			//   	// shared
			// 	}
		  	// } else if (result.action === Share.dismissedAction) {
			// 	// dismissed
		  	// }
		} catch (error) {
		  	alert(error.message);
		}
	};

	return (
		<View style={styles.videoInfo}>
			<Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{height: 'auto'}}>
				<>
				<OverlayMenuItem 
					title='Eliminar video'
					icon='delete'
					visible={uuid === user.uuid}
					onPress={deleteVideo}
				/>
				<OverlayMenuItem 
					title='Editar información'
					icon='edit'
					visible={uuid === user.uuid}
					onPress={editVideo}
				/>
				</>
			</Overlay>
			<View style={styles.videoTitle}>
				<Text style={{color:colors.title, width:'65%'}}>
					<Text style={{fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
					<Text onPress={() => {
						navigation.navigate("UserProfile", {uid: uuid});
					}}> - {author}
					</Text>
				</Text>
				<View style={styles.videoReactions}>
					<Icon name={'thumb-up'} color={colors.title} onPress={() => {react('like')}}/>
					<Text style={{marginHorizontal: 7, color: colors.title}}>{videoLikes}</Text>
					<Icon name={'thumb-down'} color={colors.title} onPress={() => {react('dislike')}} />
					<Text style={{marginHorizontal: 7, color: colors.title}}>{videoDislikes}</Text>
				</View>
			</View>
			<Text style={{color:colors.title, marginTop: 10}}>{description}</Text>
		</View>
	)
}

function CommentInput(props){
	const [user, server] = useContext(AuthContext);
	const [myComment, setMyComment] = useState('');
	const [sending, setSending] = useState(false);
	const {colors, styles} = useContext(ThemeContext);
	const [checked, setChecked] = useState(false);
	const video_id = props.videoId;
	const video_time = props.videoTime;

	function sendComment(){
		if (myComment.length < 1){
			return
		}
		setSending(true);
		server.publishComment({
			video_id: video_id,
			text: myComment,
			vid_time: checked? video_time : null
		}).then(() => {
			setSending(false);
		}, ToastError);
		setMyComment('');
	}

	return (
		<>
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
			<Icon name={'send'} color={colors.text} containerStyle={{margin:20}} onPress={sendComment} />
		</View>
		<CheckBox
			title={'Comentar en el minuto ' + getMinute(video_time)}
			checked={checked}
			onPress={() => setChecked(!checked)}
			size={16}
			containerStyle={{backgroundColor: colors.background, borderColor: colors.background}}
			checkedColor={colors.primary}
		/>
		</>
	)
}

export default function VideoScreen({route}){
	const {styles} = useContext(ThemeContext);
	const vid_id = route.params.video_id;
	const [{uuid, video_id, firebase_url, title, author, description, location, dislikes, likes, reaction}, setVideoData] = useState({});
	const [userData, server] = useContext(AuthContext);
	const [downloadURL, setDownloadURL] = useState(null);
	const [comments, setComments] = useState([]);
	const [time, setTime] = useState(0);
	const [finishedLoading, setFinishedLoading] = useState(false);
	const navigation = useNavigation();

	function fetchComments(){
        server.getVideoComments(vid_id).then(result => {
        	setComments(result.sort((a, b) => {
        		if (!a.vid_time){
        			return 1;
				}
				if (!b.vid_time){
					return -1;
				}
        		return (parseInt(a.vid_time) < parseInt(b.vid_time))? 1 : -1
	        }));
        }, ToastError);
    }

	function fetchData(force = false){
		server.getVideoInfo(vid_id, force).then(result => {
			setVideoData(result);
			return server.getFirebaseDirectURL(result.firebase_url);
		}, ToastError).then(result => {
			setDownloadURL(result);
			setFinishedLoading(true);
		}, ToastError);
	}

	function refreshData(){
		fetchData(true);
		fetchComments();
	}

	useFocusEffect(useCallback(() => {
        return navigation.addListener('focus', () => {
			setFinishedLoading(false);
			fetchData();
        	fetchComments();
        });		
	}))

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

	if (!finishedLoading){
		return (
			<LoadingView/>
		)
	}

    return (
        <View style={styles.videoContainer}>
			<Video
				style={styles.video}
				source={{uri: downloadURL}}
				useNativeControls
				shouldPlay={finishedLoading}
				resizeMode={Video.RESIZE_MODE_CONTAIN}
				onFullscreenUpdate={setOrientation}
				progressUpdateIntervalMillis={1000}
				onPlaybackStatusUpdate={status => setTime(status.positionMillis)}
			/>
			<Divider/>
			<View style={styles.commentList}>
				<FlatList 
					ListHeaderComponent={              
						<>
							<VideoInfo
								likes={likes}
								dislikes={dislikes}
								authorUid={uuid}
								title={title}
								description={description}
								videoId={video_id}
								authorName={author}
								myReaction={reaction}
								location={location}
							/>
							<Text style={styles.videoCommentsTitle}>Comentarios</Text>
							<CommentInput videoId={video_id} videoTime={time}/>
						</>
					}
					data={comments}
					renderItem={({item}) => {
						return (
							<View style={styles.videoComment}>
								<Comment author_uuid={item.uuid} text={item.text} videoTime={time} commentTime={item.vid_time}/>
							</View>
						);
					}}
					keyExtractor={item => item.comment_id.toString()}
					refreshing={false}
					onRefresh={refreshData}
				/>
			</View>
        </View>
    );
}
