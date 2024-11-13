import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import { fetchAllOffenseTypes, fetchLastUpdatedDate } from '../api';
import { StyleSheet, View } from 'react-native'


export const OffensePickerComponent = ({selectedOffense, setSelectedOffense}) => {
    const [offenseTypes, setOffenseTypes] = useState([]);

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const date = await fetchLastUpdatedDate();
                const dateFormatted = date.slice(0, 7);
                const offenseTypesData = await fetchAllOffenseTypes(dateFormatted);
                console.log('Offense types in component:', offenseTypesData);
                setOffenseTypes(offenseTypesData);
            } catch (error) {
                console.error('Error in offense picker component:', error);
            }
        };
        fetchData();
    }, [])
    return (
        <View style={styles.pickerContainer}>
            <Picker
            selectedValue={selectedOffense}
            onValueChange={(itemValue, itemIndex) => setSelectedOffense(itemValue)}
            style={styles.picker}
        >
            {offenseTypes.map((offense, index) => (
                <Picker.Item 
                    key={index}
                    label={offense.name}
                    value={offense.url}
                />
            ))}
        </Picker>
        </View>
        
    )
}

const styles = StyleSheet.create({
    pickerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 25, // Add padding to avoid overlap
        backgroundColor: '#f5f5f5',
    },
    picker: {
        width: '100%',
        height: 150, // Set a taller height for easier viewing
    },
})