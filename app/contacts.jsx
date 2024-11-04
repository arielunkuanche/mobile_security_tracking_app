import  { View, StyleSheet } from 'react-native'
import React from 'react'
import ContactsComponent from '../components/ContactsComponent'


const Contacts = () =>{
    return(
        <View style={styles.container}>
            <ContactsComponent/>
        </View>
    )
}
const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
})

export default Contacts