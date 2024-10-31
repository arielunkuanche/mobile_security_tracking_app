import  { View, Image, SafeAreaView,StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { IconButton, } from 'react-native-paper';
import { Firebase_auth } from '../config/FirebaseConfig';

const Profile = () =>{
    return(
        <SafeAreaView style={styles.container}>
            <Image style={styles.image} source={require('./../assets/images/books-8934573_1280.jpg')} blurRadius={3} />
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
            
        </SafeAreaView>
        

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        height: '100%',
        width: 460,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    logoutWrapper: {
        position: 'absolute',
        top: 15,
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
});
export default Profile