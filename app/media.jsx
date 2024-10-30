import {StyleSheet, Text, View, Image, Alert, Button, SafeAreaView} from 'react-native';
import { Camera, CameraView} from 'expo-camera';
import { Video } from 'expo-av';
import { useState, useRef, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import MediaActions from '../components/MediaActions';
import CameraControls from '../components/CameraControls';

const CameraScreen = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [facing, setFacing] = useState('back');
    const cameraRef = useRef(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    useEffect(() => {
        (async () => {
            const mediaPermissionStatus = await MediaLibrary.requestPermissionsAsync();
            const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
            const audioPermissionStatus = await Camera.requestMicrophonePermissionsAsync();
    
            setHasMediaLibraryPermission(mediaPermissionStatus.status === 'granted');
            setHasCameraPermission(cameraPermissionStatus.status === 'granted');
            setHasAudioPermission(audioPermissionStatus.status === 'granted');
        })();
    }, []);
    
    if (hasCameraPermission === null || hasAudioPermission === null || hasMediaLibraryPermission === null) {
        return <Text>Requesting permissions...</Text>;
    }
    
    if (!hasCameraPermission || !hasAudioPermission || !hasMediaLibraryPermission) {
        return Alert.alert(
            'Permissions Denied',
            'Please grant all required permissions in settings to use the camera functionality.'
        );
    }
    const takePicture = async() => {
        if(cameraRef){
            try {
                const pic = await cameraRef.current.takePictureAsync();
                console.log('here is the pic data: ', pic);
                setImage(pic.uri)
            } catch (error) {
                console.error('Error in taking pics: ', error)
            }
        }
    }
    const recordVideo = async () => {
        console.log("Attempting to start video recording...");
        if(cameraRef){
            try {
                console.log('try recording')
                setIsRecording(true)
                console.log("Calling recordAsync...");
                const videoData = await cameraRef.current.recordAsync();
                console.log('here is the video data: ', videoData);
                setVideo(videoData.uri);
            } catch (error) {
                console.error('Error in record video: ', error)
            }finally {
                setIsRecording(false); 
            }
        }else{
            console.log('cameraRef is not available')
        }
    }
    const stopRecording = () =>{
        console.log("Stopping video recording...");
        if (cameraRef) {
            console.log('try stop recording')
            setIsRecording(false);
            cameraRef.current.stopRecording();
            console.log('stopped recording')
        }
    };
    const saveToLibrary = async (uri) => {
        if(uri){
            try {
                await MediaLibrary.createAssetAsync(uri);
                Alert.alert('Saved!');
            } catch (error) {
                console.error('error in save:', error)
            }
        }
    };
    const share = async (uri) => {
        if(uri) await shareAsync(uri);
    };
    const renderImageView = ()=>{
        return (
            <SafeAreaView style={styles.container}>
                <Image source={{uri: image}} style={styles.camera} />
                <MediaActions 
                    onRetake={()=>setImage(null)}
                    onSave={()=>saveToLibrary(image)}
                    onShare={()=>share(image)}
                />
            </SafeAreaView>
        )
    };
    const renderVideoView = () => {
        return ( 
            <SafeAreaView style={styles.container}>
                <Video source={{uri: video}} style={styles.camera} useNativeControls resizeMode="contain" isLooping />
                <MediaActions 
                    onRetake={()=>setVideo(null)}
                    onSave={()=>saveToLibrary(video)}
                    onShare={()=>share(video)}
                />
            </SafeAreaView>
        )
    };
    const renderRecordingIndicator = () => {
        return (
            <View style={styles.recordingIndicator}>
                <Text style={styles.recordingText}>Recording ...</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            {image ? renderImageView()  :  video ? renderVideoView() : 
            <>
                <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                >
                    {isRecording && renderRecordingIndicator()}
                    <CameraControls 
                        isRecording={isRecording}
                        onTakePicture={takePicture}
                        onRecordVideo={recordVideo}
                        onStopRecording={stopRecording}
                        onToggleCamera={toggleCameraFacing}
                    />
                </CameraView>
            </>
        }
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        height: '80%',
        marginBottom: 20
    },
    camera: {
        flex: 1,
    },
    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 10,
        width: '100%',
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
        
    },
    recordingIndicator: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    recordingText: {
        color: 'white', 
        fontWeight: 'bold' 
    },
});

export default CameraScreen