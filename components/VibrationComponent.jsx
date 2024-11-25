import { Alert, Vibration} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { handleTimeRangeCheck } from '../utils/timeValidation';

const VibrationComponent = ({timeRange, vibrateEnabled}) => {
    useEffect(() => {
        if (!vibrateEnabled) {
            Vibration.cancel();
            return;
        };
        try {
            // handleTimeRangeCheck(timeRange.start);
            // handleTimeRangeCheck(timeRange.end); 
            // Extract start and end times from the user's time range
            const [startHour, startMinute] = timeRange.start.split(':').map(Number);
            const [endHour, endMinute] = timeRange.end.split(':').map(Number);

            // Handle vibration manually based on the schedule
            const vibrationInterval = setInterval(() => {
                const currentTime = new Date();
                const start = new Date();
                start.setHours(startHour, startMinute, 0);
                const end = new Date();
                end.setHours(endHour, endMinute, 0);

                if (currentTime >= start && currentTime <= end) {
                    Vibration.vibrate([1000, 2000], true); // Vibrate in a pattern
                } else {
                    Vibration.cancel(); // Stop vibration outside the range
                }
            }, 1000); // Check every second

            return () => {
                clearInterval(vibrationInterval);
                Vibration.cancel();
            };
        } catch (error) {
            console.error('VibrationComponent error:', error.message);
        }
    }, [timeRange, vibrateEnabled]);
    
    return null;
};
export default VibrationComponent;