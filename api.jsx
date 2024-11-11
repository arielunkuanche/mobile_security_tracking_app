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
            return offenseTypesData.name;
        }else {
            throw new Error('No offense types found');
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
        const ukAddress = data.filter(item => 
            item.display_name.includes('United Kingdom') && 
            item.display_name.includes(city)
        );
        if(ukAddress.length > 0){
            console.log('UK address matched:', ukAddress[0]);
            return ukAddress[0];
        }else {
            throw new Error('No UK address found matching the city.');
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
    }
};

export const fetchOffenseOnLocation = async (lastUpdatedDate, addressCoord) => {
    try {
        const date = lastUpdatedDate.slice(0, 7);
        console.log('Date:', date);
        const offenseUrl = `${process.env.EXPO_PUBLIC_CRIME_ON_LOCATION_API}?date=${date}&lat=${addressCoord.lat}&lng=${addressCoord.lon}`;
        console.log('Formatted offense URL:', offenseUrl); // Log the URL for debugging

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
                description: `${offense.category? offense.category : 'No offense'}, ${offense.outcome_status? offense.outcome_status.category : 'No Outcome Updated'}, ${offense.outcome_status? offense.outcome_status.date : 'No Date'}`
            }));
            return markers;
        }else {
            console.log('No offense found on location');
            return [];
        }
    } catch (error) {
        console.error('Error fetching offense on location:', error);
        return [];
    }
};