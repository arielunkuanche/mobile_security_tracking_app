import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Firebase_DB, Firebase_auth  } from '../config/FirebaseConfig';
import { getDocs, updateDoc, doc } from 'firebase/firestore';

const EditContact = ({ onClose, contact, onChangeContact}) => {
    const [updatedContact, setUpdatedContact] = useState({
        name: contact.name,
        phone: contact.phone,
    });
    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, ''); 
        const match = cleaned.match(/^(\d{1,3})(\d{0,5})(\d{0,5})$/); 
        if (match) {
            const formatted = `+${match[1]}${match[2] ? ' ' + match[2] : ''}${match[3] ? ' ' + match[3] : ''}`;
            return formatted;
        }
        alert('Invalid phone number format');
        return '';
    };
    const handlePhoneInputChange = (text) => {
        const formattedPhone = formatPhoneNumber(text);
            setUpdatedContact( { ...updatedContact, phone: formattedPhone })
    };
    const handleUpdate = async () => {
        try {
            const user = Firebase_auth.currentUser;
            const contactRef = doc(Firebase_DB, 'users', user.uid, 'contacts', contact.id);
            console.log('contactRef', contactRef);
            await updateDoc(contactRef, updatedContact);
            onChangeContact();
            alert('Changes saved');
            onClose();
        } catch (error) {
            console.error(`Error updating contact: ${error.message}`);
        }
    };
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Edit contact</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
            style={styles.input}
            value={updatedContact.name}
            onChangeText={text => setUpdatedContact({ ...updatedContact, name: text })}
            placeholder="Enter new contact name"
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
            style={styles.input}
            value={updatedContact.phone}
            onChangeText={text => handlePhoneInputChange(text)}
            placeholder="Enter phone number with country code"
            keyboardType="phone-pad"
        />
        <View style={styles.buttonContainer}>
            <Button icon='content-save-check' mode='contained' onPress={handleUpdate} buttonColor='#20b2aa' size='small'> Save changes </Button>
            <Button icon='backspace-reverse' mode='contained' onPress={onClose} buttonColor='#778899'> Cancel </Button>
        </View>
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
export default EditContact