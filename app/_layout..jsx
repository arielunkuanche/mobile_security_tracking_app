import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator} from 'react-native';
import LoginScreen from '../components/LoginScreen';
import { Firebase_auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

SplashScreen.preventAutoHideAsync();

const _layout = () => {
    const [loaded, error] = useFonts({
        'Outfit': require('../assets/fonts/Outfit-Regular.ttf'),
        'OutfitBold': require('../assets/fonts/Outfit-Bold.ttf'),
        'OutfitMedium': require('../assets/fonts/Outfit-Medium.ttf'),
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);
    useEffect(() => {   
        const auth = Firebase_auth;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Current user is: ', currentUser)
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading || !loaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large' color='black' />
            </View>
        );
    };
    return (
        <View style={{flex: 1}}>
            {user ? (
                <Tabs tabBar={ (props) => <TabBar {...props} /> }>
                    <Tabs.Screen 
                        name='index'
                        options={{
                            title: 'Home',
                        }}
                    />
                    <Tabs.Screen 
                        name='contacts'
                        options={{
                            title: 'Contacts',
                        }}
                    />
                    <Tabs.Screen 
                        name='media'
                        options={{
                            title: 'Camera',
                        }}
                    />
                    <Tabs.Screen 
                        name='profile'
                        options={{
                            title: 'Profile',
                        }}
                    />
                </Tabs>
            ) 
            : (<LoginScreen />)}
        </View>
    );
}

export default _layout