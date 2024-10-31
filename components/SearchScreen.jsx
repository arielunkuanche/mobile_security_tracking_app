import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { Video, ResizeMode} from 'expo-av';

const SearchScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Video 
                style={styles.video}
                source={{
                uri: 'https://cdn.pixabay.com/video/2023/10/22/186070-876973719_large.mp4',
                }}
                isLooping
                shouldPlay
                resizeMode={ResizeMode.COVER}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    video: {
        height: '100%',
        width: 450,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})

export default SearchScreen