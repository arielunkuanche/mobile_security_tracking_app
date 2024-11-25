import { Alert, Vibration} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { getDistance } from 'geolib';

const VibrationComponent = ({timeRange, vibrateEnabled, proximity, currentLocation, markers}) => {
    // Request notification permission
    const requestNotificationPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        console.log('Notification permission 01:', status);
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            console.log('Notification permission 02:', newStatus);
            if (newStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Please enable notifications to receive alerts.');
            }
        }
    };
    useEffect(() => {
        // Request permissions on mount
        requestNotificationPermission();

        // Add foreground notification listener
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received in foreground:', notification);
        });
        return () => subscription.remove();
    }, []);
    useEffect(() => {
        if (!vibrateEnabled || !currentLocation || markers.length === 0) {
            Vibration.cancel();
            return;
        }

        const checkProximityAndVibrate = async () => {
            const isWithinTimeRange = () => {
                const [startHour, startMinute] = timeRange.start.split(':').map(Number);
                const [endHour, endMinute] = timeRange.end.split(':').map(Number);

                const currentTime = new Date();
                const start = new Date();
                start.setHours(startHour, startMinute, 0);
                const end = new Date();
                end.setHours(endHour, endMinute, 0);
                // console.log('Current Time:', currentTime);
                // console.log('Start Time:', start);
                // console.log('End Time:', end);
                return currentTime >= start && currentTime <= end
            };

            if (!isWithinTimeRange()) return;

            const isWithinProximity = markers.some((marker) => {
                const distance = getDistance(
                    { latitude: currentLocation.lat, longitude: currentLocation.lon},
                    { latitude: marker.latitude, longitude: marker.longitude }
                );
                console.log('Distance to marker:', distance, 'Proximity:', proximity);
                return distance <= proximity; // Proximity in meters
            });

            if (isWithinProximity && isWithinTimeRange) {
                Vibration.vibrate([1000, 2000], true); // 1s vibration, 2s pause
                // Send notification
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Proximity Alert',
                        body: 'You are near a reported offense location!',
                        sound: 'default',
                    },
                    trigger: null, // Immediate notification
                }).catch((error) => {
                    console.error('Error scheduling notification:', error);
                });
            } else {
                Vibration.cancel();
            }
        };

        checkProximityAndVibrate();

        return () => {
            Vibration.cancel();
        };
    }, [vibrateEnabled, currentLocation, markers, proximity, timeRange]);

    return null;
};
export default VibrationComponent;