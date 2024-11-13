import {useState, useEffect} from 'react';
import { fetchInputAddressCoordinates, fetchLastUpdatedDate, fetchOffenseOnLocation } from '../api';
import { Keyboard } from 'react-native';

export const useFetchOffenseOnType = ({ offense, city }) => {
    const [inputCityCoords, setInputCityCoords] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });
    const [offenseMarkers, setOffenseMarkers] = useState([]);
    const [offenseMarkerTitle, setOffenseMarkerTitle] = useState('');
    const [offenseLoading, setOffenseLoading] = useState(false);

    useEffect(() => {
        console.log('Offense picked:', offense, 'City:', city);
        if (offense && city) {
            const fetchData = async () => {
                try {
                    setOffenseLoading(true);
                    const cityCoordinates = await fetchInputAddressCoordinates({ address: city, city }); 
                    // if (!cityCoordinates) {
                    //     alert('No UK address found matching the city.');
                    //     return;
                    // }
                    setInputCityCoords({
                        latitude: parseFloat(cityCoordinates.lat),
                        longitude: parseFloat(cityCoordinates.lon),
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    });
                    const lastUpdatedDate = await fetchLastUpdatedDate();
                    if (!lastUpdatedDate) throw new Error('Failed to fetch last updated date.');
                    const lastUpdatedDateFormatted = lastUpdatedDate.slice(0, 7);
                    const offenseData = await fetchOffenseOnLocation(lastUpdatedDateFormatted, cityCoordinates);
                    console.log('Offense data in use hook onType:', offenseData);
                    
                    if (offenseData.length > 0) {
                         // Log each offense category for verification
                        console.log('Get offense data category before filtering:', offenseData.map(item => item.category));

                        const filteredOffenseData = offense === 'all-crime' 
                        ? offenseData 
                        : offenseData.filter(item => item.category === offense);

                        if (filteredOffenseData.length === 0) {
                            alert('No matched offense data found in the city.');
                            return;
                        }
                        setOffenseMarkers(filteredOffenseData);
                        setOffenseMarkerTitle(cityCoordinates.display_name || 'Your input city');
                    } else {
                        alert('Currently no offense data found in the city in the latest updated month.');
                    }
                } catch (error) {
                    console.error('Error in custom hook onType:', error);
                } finally {
                    setOffenseLoading(false);
                    Keyboard.dismiss();
                }
            }
            fetchData();
        }
    }, [offense, city]);

    return { inputCityCoords, offenseMarkers, offenseMarkerTitle, offenseLoading };
};