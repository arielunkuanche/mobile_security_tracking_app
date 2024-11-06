import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, Alert, View, Share, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Firebase_DB,Firebase_auth  } from '../config/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as SMS from 'expo-sms';

const Index = () => {
    const [loadingCurLocation, setLoadingCurLocation] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(()=>{
        (async() => {
            setLoadingCurLocation(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted'){
                Alert.alert('Permission Denied', 'Permission to access location was denied.');
                setLoadingCurLocation(false);
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            console.log('here is user current location', currentLocation);
            setCurrentLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
            setLoadingCurLocation(false);
        })();
        }, [])
    const callEmergency = () => {
        Linking.openURL('tel:911'); 
        };
    // const onShare = async() => {
    //     if (!currentLocation) return;
    //     const message = `I don't feel safe. Here is my location: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude} `
    //     try {
    //         await Share.share({ message });
    //     } catch (error) {
    //         console.error('Error sharing location:', error);
    //     }
    // };
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
        <SafeAreaView style={styles.container}>
        {loadingCurLocation && <ActivityIndicator size='large' color='#0000ff' /> }
        {!loadingCurLocation && (
            <View style={styles.wrapper}>
                <MapView
                    style={styles.map}
                    region={currentLocation}
                    showsUserLocation={true}
                >
                    {currentLocation && (
                        <Marker
                            pinColor='tomato'
                            coordinate={currentLocation}
                            title='Your current location' />
                    )}
                </MapView>
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
    );
}
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
    }
});

export default Index