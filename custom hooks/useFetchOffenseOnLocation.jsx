import { useEffect, useState } from 'react';
import { Keyboard} from "react-native";
import { fetchLastUpdatedDate, fetchInputAddressCoordinates, fetchOffenseOnLocation } from '../api';

export const useFetchOffenseOnLocation = ({ address, city }) => {
    const [inputLocation, setInputLocation] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });
    const [loading, setLoading] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [markerTitle, setMarkerTitle] = useState('');
    
    useEffect(() => {
        if( address && city ){
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const addressCoordinate = await fetchInputAddressCoordinates({ address, city });
                    console.log('Address coordinate in onLocation hook:', addressCoordinate);
                    // if (!addressCoordinate) {
                    //     alert('No address found matching the UK city.');
                    // }
                    const locationWithCoord = {
                        latitude: parseFloat(addressCoordinate.lat),
                        longitude: parseFloat(addressCoordinate.lon),
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    };
                    setInputLocation(locationWithCoord);
                    const date = await fetchLastUpdatedDate();
                    if (!date) throw new Error('Failed to fetch last updated date.');

                    const offenseData = await fetchOffenseOnLocation(date, addressCoordinate);
                    setMarkers(offenseData);
                    setMarkerTitle(addressCoordinate.display_name  || 'Your input address');
                } catch (error) {
                    console.log('Error in custom hook onLocation: ', error);
                } finally {
                    setLoading(false);
                    Keyboard.dismiss();
                }
            }
            fetchData();
        }
    }, [address,city]);

    return { inputLocation, loading, markers, markerTitle};
}
