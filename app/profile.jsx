import  { View, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, ScrollView, Switch, } from 'react-native';
import React, { useEffect, useState} from 'react';
import { IconButton, } from 'react-native-paper';
import { Firebase_auth } from '../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Portal, Button, PaperProvider, TextInput } from 'react-native-paper';
import EditProfile from '../components/EditProfile';


const Profile = () =>{
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('Username');
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [contactVisible, setContactVisible] = useState(false);
    const [settingVisible, setSettingVisible] = useState(false);
    const [vibrateEnabled, setVibrateEnabled] = useState(false);
    const [timeRange, setTimeRange] = useState({start: '22:00', end: '06:00'});
    
    const showEditProfileModal = () => setEditProfileVisible(true);
    const hideEditProfileModal = () => setEditProfileVisible(false);

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
                        <TouchableOpacity style={styles.editActionButton}>
                            <Text style={styles.editButtonText} >Add Contact</Text>  
                        </TouchableOpacity>
                    </View>
                    <Button style={styles.modalButton} icon='contacts' mode='contained' onPress={showContactsModal}>
                        Your Emergency Contacts
                    </Button>
                    <Button style={styles.modalButton} icon='application-cog' mode='contained' onPress={showSettingModal}>
                        Settings
                    </Button>
                    <Portal>
                        <Modal visible={editProfileVisible} onDismiss={hideEditProfileModal} contentContainerStyle={styles.modalBackground}>
                            <EditProfile onClose={hideEditProfileModal} onChangeUsername={handleUsernameChange} />
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={contactVisible} onDismiss={hideContactsModal} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Your emergency contacts</Text>
                            <Text>Name: John Doe</Text>
                            <Text>Phone: +123456789</Text>
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={settingVisible} onDismiss={hideSettingModal} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Settings</Text>
                            <View style={styles.settingItem}>
                                <Text>Enable Vibration</Text>
                                <Switch value={vibrateEnabled} onValueChange={setVibrateEnabled} color='red'/>
                            </View>
                            <View style={styles.settingItem}>
                                <Text>Time Range</Text>
                                <TextInput
                                    mode='outlined'
                                    label='Start'
                                    value={timeRange.start}
                                    onChangeText={text => setTimeRange({...timeRange, start: text})}
                                />
                                <TextInput
                                    mode='outlined'
                                    label='End'
                                    value={timeRange.end}
                                    onChangeText={text => setTimeRange({...timeRange, end: text})}
                                />
                            </View>
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
});
export default Profile