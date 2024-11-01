import  { View, StyleSheet } from 'react-native'
import React from 'react'
import SearchScreen from '../components/SearchScreen'
import LoginScreen from '../components/LoginScreen'
import EditProfile from '../components/EditProfile'


const Search = () =>{
    return(
        <View style={styles.container}>
            <EditProfile />
        </View>
    )
}
const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
})

export default Search