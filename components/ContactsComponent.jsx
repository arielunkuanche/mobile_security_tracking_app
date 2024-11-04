import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator , keyboard, SafeAreaView} from 'react-native';
import { Button, List, Card, } from 'react-native-paper';
import { Firebase_DB,Firebase_auth  } from '../config/FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ContactsComponent = () => {
    const [contact, setContact] = useState({
        name: '',
        phone: '',
    })
    const [contacts, setContacts] = useState([]);   
    const [expandedContactId, setExpandedContactId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    // pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentContacts = contacts.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(contacts.length / itemsPerPage);

    const goToNextPage = () =>{
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);    
        }
    };
    const goToPrevPage = () =>{     
        if (currentPage > 1) {      
            setCurrentPage(currentPage - 1);
        }   
    };


    // Fetch all contacts from Firestore
    fetchContacts = async () => {   
        setLoading(true);
        try {
            const user = Firebase_auth.currentUser;
            const contactsRef = collection(Firebase_DB,'users', user.uid, 'contacts');
            const contactsSnapshot = await getDocs(contactsRef);
            console.log('fetch all contacts from firestore', contactsSnapshot.docs);
            console.log('example fetch data format', contactsSnapshot.docs[0].data());
            const contactsList = contactsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContacts(contactsList);
        } catch (error) {
            console.error(`Error fetching contacts: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {   
        fetchContacts();
    }, []);
    const handlePressAccordion = (contactId) => {
        setExpandedContactId(contactId === expandedContactId ? null : contactId);
    };
    const handleSave = async () => {
        try {
            const user = Firebase_auth.currentUser;
            const contactsRef = collection(Firebase_DB,'users', user.uid, 'contacts');
            await addDoc(contactsRef, { name: contact.name, phone: contact.phone });
            fetchContacts();
            setContact({ name: '', phone: '' });
            alert('Contact saved successfully!');
        } catch (error) {
            console.error(`Error saving contact: ${error.message}`);  
            alert('Failed to save contact');
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setContact({ name: '', phone: '' });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Emergence contacts</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={contact.name}
                onChangeText={text => setContact({ ...contact, name: text })}
                placeholder="Enter new contact name"
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={contact.phone}
                onChangeText={text => setContact({...contact, phone: text})}
                placeholder="Enter phone number with country code"
                keyboardType="phone-pad"
            />
            <View style={styles.buttonContainer}>
                <Button icon='content-save-check' mode='contained' onPress={handleSave} buttonColor='#20b2aa' > Add </Button>
                <Button icon='backspace-reverse' mode='contained' onPress={handleCancel} buttonColor='#778899'> Cancel </Button>
            </View>
            <List.Section>
                {loading ? <ActivityIndicator size='large' color='#0000ff' /> : currentContacts.length > 0 ? currentContacts.map((contact, index) => (
                    <Card key={contact.id} style={styles.contactCard}>
                        <List.Accordion
                            key={contact.id}
                            title={contact.name}
                            left={props => <List.Icon {...props} icon="account-circle" />}
                            expanded={expandedContactId === contact.id}
                            onPress={()=> handlePressAccordion(contact.id)}
                        >
                            <List.Item title={`Phone: ${contact.phone || 'Not provided'}`} />
                        </List.Accordion>
                    </Card>
                )) : <Card style={styles.noContactCard}>
                        <Card.Title title="No emergency contact"/>
                        <Card.Content>
                            <Text style={styles.noContactsText}>There is no emergency contact saved.</Text>
                        </Card.Content>
                    </Card>}
            </List.Section>
            <View style={styles.paginationContainer}>
                <Text style={styles.pageText}>{`Page ${currentPage} of ${totalPages}`}</Text>
                <Button icon='arrow-left' mode='contained' onPress={goToPrevPage} disabled={currentPage === 1} > Prev </Button>
                <Button icon='arrow-right' mode='contained' onPress={goToNextPage} disabled={currentPage === totalPages} > Next </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
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
        marginBottom: 16,
        gap: 10,
    },
    contactCard: {
        marginVertical: 5,
        borderRadius: 8,
    },
    noContactsCard: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
    },
    noContactsText: {
        fontFamily: 'OutfitMedium',
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
    },
    pageText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
});

export default ContactsComponent