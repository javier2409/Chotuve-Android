import React, { useEffect, useContext } from "react";
import { Video } from "expo-av";
import { AuthContext } from "../utilities/AuthContext";
import { useState } from "react";

export default function VideoPreview({firebase_url, thumbnail_url}){

    const [, server] = useContext(AuthContext);
    const [videourl, setVideourl] = useState(null);

    useEffect(() => {
        server.getFirebaseDirectURL(firebase_url).then(url => {
            console.log("Fetching url for preview")
            setVideourl(url);
        });
        return () => {
            console.log("Cleaning preview");
            setVideourl(null);
        }
    }, []);

    return (
        <Video
            source={{uri: videourl}}
            style={{width: '100%', aspectRatio: 16/9}}
            resizeMode='contain'
            shouldPlay={true}
            isMuted={true}
            isLooping
            usePoster
            posterSource={{uri: thumbnail_url}}
        />
    )
}