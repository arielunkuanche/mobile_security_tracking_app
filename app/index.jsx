import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, Alert, View, Linking, Keyboard, } from 'react-native';
import { Button, FAB, Portal, Modal, PaperProvider, TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Firebase_DB,Firebase_auth  } from '../config/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as SMS from 'expo-sms';
import { useFetchOffense } from '../custom hooks/useFetchOffense';

const DEFAULT_UK_LOCATION ={
    latitude: 51.509865, // Central London
    longitude: -0.118092,
    latitudeDelta: 0.15,  // Adjust to show a larger area
    longitudeDelta: 0.15,
};

const Index = () => {
    const [loadingCurLocation, setLoadingCurLocation] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [displayedLocation, setDisplayedLocation] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [inputAddressVisible, setInputAddressVisible] = useState(false);
    const [addressModalInput, setAddressModalInput] = useState({
        address: '',
        city:'',    
    });
    const [searchInputAddress, setSearchInputAddress] =  useState({ 
        address: '', 
        city: '', 
    });
    const mapViewRef = useRef(null);
    const { inputLocation, markers, loading, markerTitle } = useFetchOffense(searchInputAddress);
    
    useEffect(()=>{
        (async() => {
            setLoadingCurLocation(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted'){
                Alert.alert('Permission Denied', 'Permission to access location was denied.');
                setLoadingCurLocation(false);
                setSearchInputAddress({ address: 'London', city: 'London' }); // Default UK search
                return;
            }
            try {
                const currentLocation = await Location.getCurrentPositionAsync({});
                console.log('here is user current location', currentLocation);
    
                // Check if the user is in the UK
                const isInUK = currentLocation.coords.latitude >= 49.9 && currentLocation.coords.latitude <= 60.9 &&
                               currentLocation.coords.longitude >= -8.6 && currentLocation.coords.longitude <= 1.8;
    
                const locationCoords = isInUK ? {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                } : DEFAULT_UK_LOCATION;
    
                setCurrentLocation(locationCoords);
                setDisplayedLocation(locationCoords);

                // Trigger userFetchOffense hook with default UK location or current location city
                setSearchInputAddress(isInUK ? { address: 'Current Location', city: 'Nearby' } : { address: 'London', city: 'London' });
            } catch (error) {
                console.error('Error fetching current location:', error);
                setCurrentLocation(DEFAULT_UK_LOCATION);
                setDisplayedLocation(DEFAULT_UK_LOCATION);
                setSearchInputAddress({ address: 'London', city: 'London' }); // default UK search
            } finally {
                setLoadingCurLocation(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (inputLocation) {
            setDisplayedLocation(inputLocation);
            mapViewRef.current?.animateToRegion({
                ...inputLocation,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
            }, 2000); // Animation duration in ms
        }
    }, [inputLocation]);

    const toggleMenu = () => setMenuVisible(!menuVisible);
    const showInputAddressModal = () => setInputAddressVisible(true);
    const hideInputAddressModal = () => setInputAddressVisible(false);

    const handleSearchAddress = () => {
        if(addressModalInput.address.length === 0 || addressModalInput.city.length === 0){
            Alert.alert('Error', 'Please enter both address and city!');
            return;
        }
        setSearchInputAddress(addressModalInput);
        Keyboard.dismiss();
        hideInputAddressModal();
        toggleMenu();
        setAddressModalInput({
            address: '',
            city: '',
        })
    };
    const handleNavigateToCurrentLocation = async ()=>{
        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            const locationCoords = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
            };
            setCurrentLocation(locationCoords);
            setDisplayedLocation(locationCoords);
            mapViewRef.current?.animateToRegion(locationCoords, 2000);
            console.log('Navigated to current location:', locationCoords);
        } catch (error) {
            Alert.alert('Error', 'Failed to navigate to current location');
            console.log('Error navigating to current location:', error);
        }
    };
    const callEmergency = () => {
        Linking.openURL('tel:911'); 
    };
    const onShare = async() => {
        if (!currentLocation) return;
        const message = `I don't feel safe. Here is my location: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude} `
        try {
            const user = Firebase_auth.currentUser;
            const contactsRef = collection(Firebase_DB, 'users', user.uid, 'contacts');
            const contactsSnapshot = await getDocs(contactsRef);
            const contactsList = contactsSnapshot.docs
                                .map(doc => doc.data().phone)
                                .filter(phone => phone && phone.length > 0);
            console.log('contactsList', contactsList);
            if (contactsList.length > 0){
                await SMS.sendSMSAsync(
                    contactsList,
                    message,    
                );
            }else{
                alert('No emergency contacts found');
            }
        } catch (error) {
            console.error('Error sharing location via SMS:', error);
        }
    };

    return(
        <PaperProvider>
            <SafeAreaView style={styles.container}>
            {loadingCurLocation && <ActivityIndicator size='large' color='#20b2aa' /> }
            {!loadingCurLocation && (
                <View style={styles.wrapper}>
                    <MapView
                        ref={mapViewRef}
                        style={styles.map}
                        region={displayedLocation} 
                        showsUserLocation={true}
                    >
                        {currentLocation && (
                            <Marker
                                pinColor='#b8860b'
                                coordinate={currentLocation}
                                title='Your current location' 
                            />
                        )}
                        {inputLocation && (
                            <Marker
                                pinColor='#b8860b'
                                coordinate={inputLocation}
                                title={markerTitle} 
                            />
                        )}
                        {markers.map((marker, index) =>(
                            <Marker
                                key={index}
                                pinColor='#e9967a'
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude,
                                }}
                                title={marker.title}
                                description={marker.description || 'None'}
                            />
                        ))}
                    </MapView>
                    <FAB 
                        style={styles.fab}
                        icon='menu'
                        onPress={toggleMenu}
                    />
                    <Button 
                        icon='navigation-variant-outline' 
                        mode='text'
                        style={styles.navigateButton}
                        onPress={handleNavigateToCurrentLocation}
                    />
                    <Portal>
                        <Modal visible={menuVisible} onDismiss={toggleMenu} contentContainerStyle={styles.modalContainer}>
                            <Button icon="logout" mode="text" onPress={() => Firebase_auth.signOut()} style={styles.menuButton}>Logout</Button>
                            <Button icon="map-search-outline" mode="text" onPress={showInputAddressModal} style={styles.menuButton}>Address Search</Button>
                            <Button icon="magnify" mode="text" onPress={() => console.log('Offense pressed')} style={styles.menuButton}>Offense Type</Button>
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={inputAddressVisible} onDismiss={hideInputAddressModal} contentContainerStyle={styles.modalContainer}>
                            <TextInput 
                                label='Enter your searched address'
                                value={addressModalInput.address}
                                onChangeText={text => setAddressModalInput({...addressModalInput, address: text})}
                                style={{width: '100%'}}
                            />
                            <TextInput 
                                label='Enter the city'
                                value={addressModalInput.city}
                                onChangeText={text => setAddressModalInput({...addressModalInput, city: text})}
                                style={{width: '100%', marginTop: 10}}
                            />
                            <Button icon="magnify" mode="contained" onPress={handleSearchAddress} style={styles.menuButton}>Search</Button>
                        </Modal>
                    </Portal>
                    <View style={styles.buttonWrapper}>
                        <Button icon="phone" mode='contained' buttonColor='#20b2aa'onPress={callEmergency} >
                            Call 911
                        </Button>
                        <Button icon="share" mode='contained' buttonColor='#20b2aa' onPress={onShare} >
                            Share
                        </Button>
                    </View>
                </View>
            )}
            <StatusBar style="auto" />
        </SafeAreaView>
    </PaperProvider>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 60,
        backgroundColor: '#fff',
        
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: { 
        width: '100%', 
        height: '80%',
    },
    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 10,
        width: '100%',
        paddingHorizontal: 20,
    },
    fab: {
        position: 'absolute',
        top: 5,
        right: 16,
        backgroundColor: '#20b2aa',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    menuButton: {
        marginVertical: 10,
        width: '100%',
    },
    navigateButton:{
        position: 'absolute',
        bottom: 80,
        right: 16,
        height: 100,
        padding: 10,
        borderRadius: 5,
    },
});

export default Index