import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';

const CameraControls = ({isRecording, onTakePicture, onRecordVideo, onStopRecording, onToggleCamera})=>{
    return(
        <View style={styles.buttonWrapper} >
            <TouchableOpacity style={styles.button} onPress={onTakePicture}>
                <Entypo name='camera' size={24} color={'#f1f1f1'} />
                <Text style={styles.text}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onToggleCamera}>
                <MaterialIcons name="flip-camera-ios" size={24} color="#f1f1f1" />
                <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={isRecording ? onStopRecording : onRecordVideo} >
                {isRecording ?  <Feather name="stop-circle" size={24} color="#f1f1f1" /> : <Feather name="video" size={24} color="#f1f1f1" /> }
                <Text style={styles.text}>{isRecording ? 'Stop' : 'Record'}</Text> 
            </TouchableOpacity>
        </View>
    )
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
});

export default CameraControls