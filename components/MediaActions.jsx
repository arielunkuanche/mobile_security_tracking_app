import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const MediaActions = ({onRetake, onSave, onShare}) => {
    return (
        <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.button} onPress={onRetake}>
                <MaterialCommunityIcons name="camera-retake" size={24} color="#f1f1f1"  />
                <Text style={styles.text}>Re-take</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onSave}>
                <MaterialIcons name="save-alt" size={24} color="#f1f1f1" />
                <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onShare}>
                <FontAwesome6 name="share-from-square" size={20} color="#f1f1f1"  />
                <Text style={styles.text}>Share</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default MediaActions