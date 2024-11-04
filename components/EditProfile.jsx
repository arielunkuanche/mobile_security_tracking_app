import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Firebase_auth,  } from '../config/FirebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const EditProfile = ({ onClose, onChangeUsername, currentUsername}) => {
    const [username, setUsername] = useState(currentUsername);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    useEffect(() => {   
        const auth = Firebase_auth;
        const currentUser = auth.currentUser;
        if (currentUser) {
            if (username === '') {
                setUsername(currentUser.email.slice(0, 5));   
            }
            setEmail(currentUser.email || '');
        }  
        // setUsername(currentUser.email.slice(0, 5));     
    }, [currentUsername]);
    const handleSave = async () => {

        try {
            const user = Firebase_auth.currentUser;
            if (newPassword) {
                const credential = EmailAuthProvider.credential(email, password) 
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                alert('Password updated successfully!');
            }
            onChangeUsername(username);
            alert('Profile saved');
            onClose();
        } catch (error) {
            alert(`Error updating password: ${error.message}`);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter email"
            />
            <Text style={styles.label}>Current Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter current password to update"
            />
            <Text style={styles.label}>New Password</Text>
            <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
            />
            <View style={styles.buttonContainer}>
                <Button icon='content-save-check' mode='contained' onPress={handleSave} buttonColor='#20b2aa' > Save changes </Button>
                <Button icon='backspace-reverse' mode='contained' onPress={onClose} buttonColor='#778899'> Cancel </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontFamily: 'OutfitBold',
        fontSize: 22,
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'OutfitMedium',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        gap: 10,
    },
});

export default EditProfile;