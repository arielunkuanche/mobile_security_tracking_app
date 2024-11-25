import  { View, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView, Switch, Alert, Keyboard} from 'react-native';
import React, { useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { IconButton, } from 'react-native-paper';
import { Firebase_auth } from '../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Portal, Button, PaperProvider, TextInput } from 'react-native-paper';
import EditProfile from '../components/EditProfile';
import VibrationComponent from '../components/VibrationComponent';
import { handleTimeRangeCheck } from '../utils/timeValidation';
import { fetchOffenseOnLocation } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = () =>{
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('Username');
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [contactVisible, setContactVisible] = useState(false);
    const [settingVisible, setSettingVisible] = useState(false);
    const [notificationEnable, setNotificationEnable] = useState(false);
    const [vibrateEnabled, setVibrateEnabled] = useState(false);
    const [timeRange, setTimeRange] = useState({start: '22:00', end: '06:00'});
    const [proximity, setProximity] = useState(500);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [offenseMarkers, setOffenseMarkers] = useState([]);    

    const showEditProfileModal = () => setEditProfileVisible(true);
    const hideEditProfileModal = () => setEditProfileVisible(false);

    const showNotificationModal = () => setNotificationVisible(true);
    const hideNotificationModal = () => setNotificationVisible(false);

    const showContactsModal = () => setContactVisible(true);
    const hideContactsModal = () => setContactVisible(false);

    const showSettingModal = () => setSettingVisible(true);
    const hideSettingModal = () => setSettingVisible(false);

    useEffect(() => {   
        const auth = Firebase_auth;
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUsername(currentUser.email.slice(0, 5));
        }
    }, []); 
    useEffect(() => {
        // set up a default location in UK and fetch offense data to test the vibration feature
        const fetchInitialOffenseData = async () => {
            try {
                const mockLocation = {
                    lat: 51.5074456, 
                    lon: -0.1277653, 
                };
                setCurrentLocation(mockLocation);
                const mockedDate = '2024-09';
                const markers = await fetchOffenseOnLocation(mockedDate, mockLocation);
                console.log('Markers in Profile init:', markers);
                setOffenseMarkers(markers);
            } catch (error) {
                console.error('Error fetching initial offense data in Profile:', error);
            }
            
        };
    
        fetchInitialOffenseData();
    }, []);
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedTimeRange = await AsyncStorage.getItem('timeRange');
                const savedProximity = await AsyncStorage.getItem('proximity');
                const savedVibrateEnabled = await AsyncStorage.getItem('vibrateEnabled');
    
                if (savedTimeRange) setTimeRange(JSON.parse(savedTimeRange));
                if (savedProximity) setProximity(parseInt(savedProximity, 10));
                if (savedVibrateEnabled) setVibrateEnabled(JSON.parse(savedVibrateEnabled));
            } catch (error) {
                console.error('Failed to load vibration setting values in Profile:', error);
            }
        };
    
        loadSettings();
    }, []);
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log('image selected: ', result);
        if (!result.canceled) {
            console.log('image: ', result);
            setImage(result.assets[0].uri);
        }
    };
    const handleUsernameChange = (newUsername) => {
        setUsername(newUsername);
    };
    const handleStopVibration = () => {
        setVibrateEnabled(false); 
        console.log('Vibration stopped manually.');
    };
    const handleStartBlur = () => {
        try {
            const validStart = handleTimeRangeCheck(timeRange.start);
            setTimeRange({ ...timeRange, start: validStart });
        } catch (error) {
            Alert.alert('Invalid input of the time: ', error.message);
        }
    };
    const handleEndBlur = () => {
        try {
            const validEnd = handleTimeRangeCheck(timeRange.end);
            setTimeRange({ ...timeRange, end: validEnd });
        } catch (error) {
            Alert.alert('Invalid input of the time: ', error.message);
        }
    };
    const saveAsyncSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            console.log(`Saved async ${key}:`, value);
        } catch (error) {
            console.error(`Failed to save ${key}:`, error);
        }
    };
    // async saving logics
    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
        saveAsyncSettings('timeRange', newTimeRange);
    };
    const handleProximityChange = (value) => {
        if (value === '') {
            setProximity(value); 
            return;
        }
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setProximity(numericValue);
            saveAsyncSettings('proximity', numericValue);
        };
    };
    const handleVibrateEnabledChange = (value) => {
        setVibrateEnabled(value);
        saveAsyncSettings('vibrateEnabled', value);
    };
    return(
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <Image style={styles.image} source={require('./../assets/images/books-8934573_1280.jpg')} resizeMode='cover'/>
                <View style={styles.logoutWrapper}>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => Firebase_auth.signOut()}>
                    <IconButton
                        style={styles.iconButton}
                        icon="logout"
                        size={22}
                        iconColor= 'white'
                    />
                    <Text style={styles.logoutText}>Log out</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.profileInfoContainer}>
                        <TouchableOpacity style={styles.profileImageWrapper} onPress={handleImageSelection}>
                            <Image 
                                source={image ? {uri: image} : require('./../assets/images/photographer-5149664_1280.jpg')} 
                                style={styles.profileImage}
                            />
                            <View style={styles.cameraIcon}>
                                <IconButton
                                    icon="camera"
                                    size={30}
                                    iconColor='grey' 
                                    />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.userName}>{username}</Text>
                    </View>
                    <View style={styles.editButtonContainer}>
                        <TouchableOpacity style={styles.editActionButton} onPress={showEditProfileModal}>
                            <Text style={styles.editButtonText} >Edit Profile</Text>  
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.editActionButton} onPress={showNotificationModal}>
                            <Text style={styles.editButtonText} >Notification</Text>  
                        </TouchableOpacity>
                    </View>
                    <Button style={styles.modalButton}  labelStyle={styles.buttonText} icon="shield-check-outline" mode='contained' onPress={showContactsModal}>
                        Your privacy
                    </Button>
                    <Button style={styles.modalButton}  labelStyle={styles.buttonText} icon='application-cog' mode='contained' onPress={showSettingModal}>
                        Vibration settings
                    </Button>
                    <VibrationComponent
                        timeRange={timeRange}
                        vibrateEnabled={vibrateEnabled}
                        markers={offenseMarkers}
                        proximity={proximity}
                        currentLocation={currentLocation}
                    />
                    <Portal>
                        <Modal visible={editProfileVisible} onDismiss={hideEditProfileModal} contentContainerStyle={styles.modalBackground}>
                            <EditProfile onClose={hideEditProfileModal} onChangeUsername={handleUsernameChange} />
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={notificationVisible} onDismiss={hideNotificationModal} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Notification</Text>
                                <Text>Enable push notification if you want to receive our updates.</Text>
                                <View style={styles.settingItem}>
                                    <Text>Enable</Text>
                                    <Switch value={notificationEnable} onValueChange={setNotificationEnable} color='red'/>
                                </View>
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={contactVisible} onDismiss={hideContactsModal} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Privacy Settings</Text>
                            <View style={styles.privacySettingItem}>
                                <Text style={styles.privacyTextHeader} >How We Use Your Data:</Text>
                                {
                                `- We use your location data to provide real time alerts near reported offenses.
                                - Notification settings are configurable under Vibration Settings.
                                - Your data is not shared with third parties.`.split('-').map((item, index) =>
                                    item.trim() ? (
                                        <Text key={index} style={styles.privacyText}>
                                            • {item.trim()}
                                        </Text>
                                    ) : null
                                )}
                            </View>
                            <View style={styles.privacySettingItem}>
                                <Text style={styles.privacyTextHeader}>Manage App Permissions:</Text>
                                <Button
                                    icon="lock-outline"
                                    mode="contained"
                                    style={styles.modalButton}
                                    labelStyle={styles.buttonText}
                                    onPress={() => {
                                        Alert.alert(
                                            'Manage Permissions',
                                            'Please visit your device settings to manage location and notification permissions.'
                                        );
                                    }}
                                >
                                    Open Device Settings
                                </Button>
                            </View>
                            <View style={styles.privacySettingItem}>
                                <Text style={styles.privacyTextHeader}>Account Management:</Text>
                                <Button
                                    icon="account-cancel-outline"
                                    mode="contained"
                                    style={styles.modalButton}
                                    labelStyle={styles.buttonText}
                                    onPress={() => {
                                        Alert.alert(
                                            'Delete Account',
                                            'Account deletion is permanent and cannot be undone. Contact support if needed.',
                                            [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }]
                                        );
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </View>
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={settingVisible} onDismiss={hideSettingModal} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Vibration settings</Text>
                            <View style={styles.settingItem}>
                                <Text>Enable Vibration</Text>
                                <Switch value={vibrateEnabled} onValueChange={handleVibrateEnabledChange} color='red'/>
                            </View>
                            <View style={styles.settingItem}>
                                <Text>Time Range(HH:MM)</Text>
                                <TextInput
                                    style={styles.textInput}
                                    mode='outlined'
                                    label='Start'
                                    value={timeRange.start}
                                    onChangeText={(text) => handleTimeRangeChange({ ...timeRange, start: text })}
                                    onBlur={handleStartBlur} //Validate an input field when the user leaves it: onBlur
                                    disabled={!vibrateEnabled}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    mode='outlined'
                                    label='End'
                                    value={timeRange.end}
                                    onChangeText={(text) => handleTimeRangeChange({ ...timeRange, end: text })}
                                    onBlur={handleEndBlur}
                                    disabled={!vibrateEnabled}
                                />
                            </View>
                            <View style={styles.settingItem}>
                                <Text>Proximity (meters)</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={proximity.toString()}
                                    onChangeText={handleProximityChange}
                                    keyboardType="numeric"
                                    disabled={!vibrateEnabled}
                                />
                            </View>
                            <Button mode="contained" style={styles.modalButton}  labelStyle={styles.buttonText} onPress={handleStopVibration}>Stop Vibration</Button>
                        </Modal>
                    </Portal>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        height: 220,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    logoutWrapper: {
        position: 'absolute',
        top: 5,
        right: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0000005c',
        padding:2,
        borderRadius: 15,
    },
    iconButton: {
        marginRight: 5,
    },
    logoutText: {
        fontFamily:'OutfitBold',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        right: 10,
    },
    profileInfoContainer: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 130
    },
    profileImageWrapper: { 
        padding: 5, 
        borderRadius: 15
    },
    profileImage: {
        width: 160, 
        height: 160, 
        borderRadius: 85, 
        borderWidth:2, 
        borderColor:'#0000005c'
    },
    cameraIcon: {
        position: 'absolute', 
        bottom: -5, 
        right: 0, 
        backgroundColor: '#fffaf0', 
        size: 20,
        borderRadius: 10
    },
    userName: {
        fontFamily:'OutfitBold', 
        fontSize: 20, 
        color: 'grey', 
        textAlign: 'center', 
        marginBottom:10
    },
    editButtonContainer: {
        flexDirection: 'row',
        gap: 20,
        fontFamily:'OutfitBold', 
        fontSize: 20, 
        color: 'grey', 
        textAlign: 'center', 
        marginBottom:10
    },
    editActionButton:{
        padding: 7, 
        borderRadius: 10, 
        backgroundColor: '#778899', 
        width:124, 
        height: 36, 
        alignItems:'center'
    },
    editButtonText: {
        fontFamily:'OutfitBold', 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: 'white', 
        textAlign: 'center'
    },
    modalButton: {
        marginTop: 30,
        backgroundColor: '#778899',
        color: 'white',
    },
    buttonText: {
        color: 'white', // Ensure the button text color is white
    },
    modalBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        left: 20,
    },
    modalTitle: {
        fontFamily: 'OutfitBold',
        fontSize: 18,
        marginBottom: 15,
        color: 'black',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    textInput: {
        backgroundColor: '#ccc',
        marginVertical: 5,
        borderColor: '#ccc',
        color: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    privacySettingItem: {
        flexDirection: 'column',
        alignItems: 'flex-start', // Align text to the left
        marginVertical: 5,
    },
    privacyTextHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    privacyText: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
        lineHeight: 20,
    },
});
export default Profile