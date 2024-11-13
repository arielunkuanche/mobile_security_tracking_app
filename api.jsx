// This file contains the functions to fetch data from the APIs. 
// The functions are used in the custom hook useFetchOffenseOnLocation, useFetchOffenseOnType to fetch the last updated date, offense types, address coordinates, and offense data on the location. 

export const fetchLastUpdatedDate = async () => {
    try {
        const dateUrl = process.env.EXPO_PUBLIC_LAST_UPDATED_DATE_API;
        const response = await fetch(dateUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok in fetch last updated date.');
        }
        const data = await response.json();
        if (!data.date) {
            throw new Error('No date found in last updated date data.');
        }
        const lastUpdatedDate = data.date;
        return lastUpdatedDate;
    } catch (error) {
        console.error('Error fetching last updated date:', error);
    }
};

export const fetchAllOffenseTypes = async (lastUpdatedDate) => {
    try {
        const date = lastUpdatedDate.slice(0, 7);
        console.log('Date:', date);
        const offenseTypesUrl = `${process.env.EXPO_PUBLIC_OFFENSE_TYPES_API}?date=${date}`;
        const response = await fetch(offenseTypesUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok in fetch offense types.');
        }
        const offenseTypesData = await response.json();
        if(offenseTypesData.length > 0){
            return offenseTypesData;
        }else {
            alert('No offense found in the last updated month!');
        }
    } catch (error) {
        console.error('Error fetching offense types:', error);
    }
};

export const fetchInputAddressCoordinates = async ({ address, city }) => {
    try {
        const addressUrl = `${process.env.EXPO_PUBLIC_GEOCODING_API_URL}?q=${address}&api_key=${process.env.EXPO_PUBLIC_GEOCODING_API_KEY}`;
        const response = await fetch(addressUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok in fetch address coordinates.');
        }
        const data = await response.json();
        console.log('Converted from address to coordinates by geocoding:', data);
        const ukAddress = data.filter(item => 
            item.display_name.includes('United Kingdom') && 
            item.display_name.includes(city)
        );
        if(ukAddress.length > 0){
            console.log('UK address matched:', ukAddress[0]);
            return ukAddress[0];
        }else {
            alert('No address found matching the UK city.');
            return;
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
    }
};

export const fetchOffenseOnLocation = async (lastUpdatedDate, addressCoord) => {
    try {
        const date = lastUpdatedDate.slice(0, 7);
        const offenseUrl = `${process.env.EXPO_PUBLIC_CRIME_ON_LOCATION_API}?date=${date}&lat=${addressCoord.lat}&lng=${addressCoord.lon}`;
        console.log('Formatted offense URL:', offenseUrl); 

        const response = await fetch(offenseUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok in fetch offense on location.');
        }
        const offenseData = await response.json();
        console.log('Offense on location:', offenseData);
        if(offenseData.length > 0){
            const markers = offenseData.map((offense, index) => ({
                latitude: parseFloat(offense.location.latitude) + (index * 0.0001),
                longitude: parseFloat(offense.location.longitude) + (index * 0.0002),
                title: offense.location.street.name || 'Unknown Location',
                category: offense.category,
                description: `${offense.category? offense.category : 'No offense'}, ${offense.outcome_status? offense.outcome_status.category : 'No updated results yet'}, ${offense.outcome_status? offense.outcome_status.date : 'No updated result date data'}`
            }));
            console.log('Markers in onLocation API:', markers);
            return markers;
        }else {
            console.log('No offense found on location');
            alert('No offense found on this location in this month!');
            return [];
        }
    } catch (error) {
        console.error('Error fetching offense on location:', error);
        return [];
    }
};
