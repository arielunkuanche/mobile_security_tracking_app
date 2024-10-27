import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '../components/TabBar'

const _layout = () => {
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