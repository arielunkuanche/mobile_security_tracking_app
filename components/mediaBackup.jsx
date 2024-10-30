import {StyleSheet, Text, View, Image, Alert, Button, SafeAreaView} from 'react-native';
import { Camera, CameraView} from 'expo-camera';
import { Video } from 'expo-av';
import { useState, useRef, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { shareAsync } from 'expo-sharing';

const CameraScreen = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    // const [facing, setFacing] = useState('back');
    const cameraRef = useRef(null);

    function toggleCameraFacing() {
        setType(current => (current === 'back' ? 'front' : 'back'));
    }
    useEffect(() => {
        (async () => {
            const mediaPermissionStatus = await MediaLibrary.requestPermissionsAsync();
            console.log('media permission',mediaPermissionStatus.status);
            setHasMediaLibraryPermission(mediaPermissionStatus.status);
            
            const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
            console.log('camera permission', cameraPermissionStatus.status);
            setHasCameraPermission(cameraPermissionStatus.status);

            const audioPermissionStatus = await Camera.requestMicrophonePermissionsAsync();
            console.log('audio permission',audioPermissionStatus.status);
            setHasAudioPermission( audioPermissionStatus.status);
        })();
    }, []);
    if(hasCameraPermission === undefined || hasAudioPermission === undefined){
        return <Text>Request permissions to use camera...</Text>
    }else if(hasCameraPermission !== 'granted') {
        return Alert.alert('Camera use is not granted. Please go to phone setting to enable!')
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
    const savePicture = async () =>{
        if(image){
            try {
                await MediaLibrary.createAssetAsync(image);
                Alert.alert('Picture saved!');
                setImage(null);
            } catch (error) {
                console.error('error in save image:', error)
            }
        }
    } 
    const shareImage = async () => {
        if(image) await shareAsync(image);
        setImage(null);
    }
    const recordVideo = async () => {
        console.log("Starting video recording...");
        if(cameraRef){
            try {
                console.log('here is the try of recording')
                setIsRecording(true)
                const options = {
                    quality: '1080p',
                    maxDuration: 60,
                    mute:false,
                }
                const videoData = await cameraRef.current.recordAsync(options);
                console.log('here is the video data: ', videoData);
                setVideo(videoData.uri);
                setIsRecording(false);
            } catch (error) {
                console.error('Error in record video: ', error)
            }
        }
    }
    const stopRecording = () =>{
        console.log("Stopping video recording...");
        if (cameraRef) {
            console.log('here is the try stop recording')
            setIsRecording(false);
            cameraRef.current.stopRecording();
        }
    };
    if(video) {
        return (
            <SafeAreaView style={styles.camera}>
                <Video
                    style={styles.video}
                    source={{uri: video}}
                    useNativeControls
                    resizeMode='contain'
                    isLooping
                >
                <Button title='Share' ></Button>
                <Button title='Re-take' onPress={()=> setVideo(null)}></Button>
                </Video>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            {!image ? 
            <CameraView
                style={styles.camera}
                facing={type}
                flash={flash}
                ref={cameraRef}
                
            >
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button}>
                        <Entypo name='camera' size={25} color={'#f1f1f1'} onPress={takePicture}/>
                        <Text style={styles.text}>Take photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <MaterialIcons name="flip-camera-ios" size={25} color="#f1f1f1" onPress={toggleCameraFacing}/>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={isRecording ? stopRecording : recordVideo} >
                        {isRecording ?  <Feather name="stop-circle" size={24} color="#f1f1f1" /> : <Feather name="video" size={24} color="#f1f1f1" /> }
                        <Text style={styles.text}>{isRecording ? 'Stop Record' : 'Record Video'}</Text> 
                    </TouchableOpacity>
                </View>
            </CameraView>
            : 
            <Image source={{uri: image}} style={styles.camera} />
        }
            <View>
                {image ? 
                    <View style={styles.actionButtonWrapper}>
                        <TouchableOpacity style={styles.button}>
                            <MaterialCommunityIcons name="camera-retake" size={25} color="#f1f1f1" onPress={() => setImage(null)} />
                            <Text style={styles.text}>Re-take</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <MaterialIcons name="save-alt" size={25} color="#f1f1f1" onPress={savePicture}/>
                            <Text style={styles.text}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <FontAwesome6 name="share-from-square" size={20} color="#f1f1f1" onPress={(image)=> shareImage(image)} />
                            <Text style={styles.text}>Share</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <TouchableOpacity style={styles.button}>
                        <Entypo name='camera' size={25} color={'#f1f1f1'} onPress={takePicture}/>
                        <Text style={styles.text}>Take photo</Text>
                    </TouchableOpacity>
                }
                {

                }
            </View>
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
    button: {
        height: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#f1f1f1',
        marginLeft: 10
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
    actionButtonWrapper: {
        position: 'absolute',
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingVertical: 10, 
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        bottom: 70, 
        width: '100%',
    },
    recordingIndicator: {
        position: 'absolute',
        top: 20,
        left: 20,
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