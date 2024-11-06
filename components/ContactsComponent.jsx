import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator , keyboard, SafeAreaView} from 'react-native';
import { Button, List, Card, Modal, Portal, } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';
import { Firebase_DB,Firebase_auth  } from '../config/FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import EditContact from './EditContact';


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
    const [editContactVisible, setEditContactVisible] = useState(false);
    const showEditContactModal = () => setEditContactVisible(true);
    const hideEditContactModal = () => setEditContactVisible(false);
    const [selectedContactToEdit, setSelectedContactToEdit] = useState(null);

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
    const handlePhoneNumberChange = (text) => {
        const cleaned = ('' + text).replace(/\D/g, ''); // Remove all non-numeric characters
        const match = cleaned.match(/^(\d{1,3})(\d{0,5})(\d{0,5})$/); // Match the number into groups
        if (match) {
            const formatted = `+${match[1]}${match[2] ? ' ' + match[2] : ''}${match[3] ? ' ' + match[3] : ''}`;
            setContact({ ...contact, phone: formatted });
        }else{
            alert('Invalid phone number format');
        }
};
    // Fetch all contacts from Firestore
    const fetchContacts = async () => {   
        setLoading(true);
        try {
            const user = Firebase_auth.currentUser;
            const contactsRef = collection(Firebase_DB,'users', user.uid, 'contacts');
            const contactsSnapshot = await getDocs(contactsRef);
            console.log('fetch all contacts from firestore', contactsSnapshot.docs);
            //console.log('example fetch data format', contactsSnapshot.docs[0].data());
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
        const minLength = 11;
        const maxLength = 15;
        if(contact.phone.replace(/\D/g, '').length < minLength || contact.phone.replace(/\D/g, '').length > maxLength){
            alert('Phone number must be between 11 and 15 characters');
            return;
        };
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
    const editContact = async (contactID) => {
        const contactToEdit = contacts.find(contact => contact.id === contactID);
        setSelectedContactToEdit(contactToEdit);
        showEditContactModal();
    };
    const deleteContact = async (contactID) => {
        try {
            const user = Firebase_auth.currentUser;
            const contactRef = doc(Firebase_DB, 'users', user.uid, 'contacts', contactID);
            await deleteDoc(contactRef);
            fetchContacts();
            alert('Contact deleted successfully!');
        } catch (error) {
            console.error(`Error deleting contact: ${error.message}`);
        }
    };
    return (
        <PaperProvider>
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
                    onChangeText={text => handlePhoneNumberChange(text)}
                    placeholder="Enter phone number with country code"
                    keyboardType="phone-pad"
                />
                <View style={styles.buttonContainer}>
                    <Button icon='content-save-check' mode='contained' onPress={handleSave} buttonColor='#20b2aa' size='small'> Add </Button>
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
                                <View style={styles.cardDetailStyle}>
                                    <Button icon='account-edit-outline' mode='elevated' buttonColor='#deb887' textColor='white' onPress={() => editContact(contact.id)}>Edit</Button>
                                    <Button icon='delete-circle' mode='elevated' buttonColor='#778899' textColor='white' onPress={() => deleteContact(contact.id)}>Delete</Button>
                                </View>
                                
                            </List.Accordion>
                        </Card>
                    )) : <Card style={styles.noContactCard}>
                            <Card.Title title="No emergency contact"/>
                            <Card.Content>
                                <Text style={styles.noContactsText}>There is no emergency contact saved.</Text>
                            </Card.Content>
                        </Card>}
                </List.Section>
                <Portal>
                    <Modal visible={editContactVisible} onDismiss={hideEditContactModal} contentContainerStyle={styles.modalBackground}>
                        {selectedContactToEdit && 
                        <EditContact 
                            onClose={hideEditContactModal} 
                            contact={selectedContactToEdit} 
                            onChangeContact={fetchContacts}
                        />}
                    </Modal>
                </Portal>
                <View style={styles.paginationContainer}>
                    <Text style={styles.pageText}>{`Page ${currentPage} of ${totalPages}`}</Text>
                    <Button icon='arrow-left' mode='contained' onPress={goToPrevPage} disabled={currentPage === 1} > Prev </Button>
                    <Button icon='arrow-right' mode='contained' onPress={goToNextPage} disabled={currentPage === totalPages} > Next </Button>
                </View>
            </View>
        </PaperProvider>
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
    cardDetailStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: '38%',
        gap: 10,
        marginRight: 10,
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
    modalBackground: {
        width: '80%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor:'white',
        borderRadius: 10,
        padding: 20,
    },
});

export default ContactsComponent