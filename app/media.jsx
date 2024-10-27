import {StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { Camera, CameraView} from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { TouchableOpacity } from 'react-native';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const CameraScreen = () => {
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
            console.log(mediaPermissionStatus.status)
            setHasCameraPermission(mediaPermissionStatus.status);
            const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
            console.log(cameraPermissionStatus.status)
            setHasMediaLibraryPermission(cameraPermissionStatus.status);
        })();
    }, [])
    
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
    return (
        <View style={styles.container}>
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
                    <TouchableOpacity style={styles.button}>
                        <Feather name="video" size={24} color="#f1f1f1" />
                        <Text style={styles.text}>Record video</Text>
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
                            <FontAwesome6 name="share-from-square" size={20} color="#f1f1f1" onPress={()=> console.log('Shared pressed.')} />
                            <Text style={styles.text}>Share</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <TouchableOpacity style={styles.button}>
                        <Entypo name='camera' size={25} color={'#f1f1f1'} onPress={takePicture}/>
                        <Text style={styles.text}>Take photo</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
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
        paddingHorizontal: 20,
        alignSelf: 'flex-end',
        
    },
    actionButtonWrapper: {
        position: 'absolute',
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingVertical: 20, 
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        bottom: 90, 
        width: '100%',
}
});

export default CameraScreen