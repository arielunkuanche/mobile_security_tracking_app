import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '../components/TabBar'
import { useFonts } from 'expo-font';

const _layout = () => {
    // const [loaded, error] = useFonts({
    //     'Outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    // });
    
    return (
        <Tabs 
            tabBar={ (props) => <TabBar {...props} /> } 
        >
            <Tabs.Screen 
                name='index'
                options={{
                    title: 'Home',
                    // headerShown: false,
                }}
            />
            <Tabs.Screen 
                name='search'
                options={{
                    title: 'Search',
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
    );
}

export default _layout