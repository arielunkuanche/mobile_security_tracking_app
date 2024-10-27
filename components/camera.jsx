import {StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';

const CameraScreen = () =>{
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const [image, setImage] = useState(null);
    // const [facing, setFacing] = useState('back');
    const cameraRef = useRef(null);
    function toggleCameraFacing() {
        setType(current => (current === 'back' ? 'front' : 'back'));
    }
    useEffect(() => {
        (async () => {
            const mediaPermissionStatus = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaPermissionStatus === 'granted')
            const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraPermissionStatus.status === 'granted');
        })();
    }, [])
    if (hasCameraPermission !== 'granted'|| hasMediaLibraryPermission !== 'granted') {
        return <Text>No access to camera and media</Text>
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
    return (
        <View style={styles.container}>
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
                    <TouchableOpacity style={styles.button}>
                    <Feather name="video" size={24} color="#f1f1f1" />
                        <Text style={styles.text}>Record video</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        borderRadius: 20,
    },
    button: {
        height: 30,
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
        paddingHorizontal: 20,
        alignSelf: 'flex-end',
        
    },
});

export default CameraScreen