export const handleTimeRangeCheck = (time) =>{
    if (time.length === 2 && !time.includes(':')) {
        time = time + ':';
    }
    if (time.length > 5) {
        throw new Error('Invalid time format. Please use HH:MM.');
    }
    const [hour, minute] = time.split(':').map(Number);
    if (
        isNaN(hour) || 
        isNaN(minute) ||
        hour < 0 || hour > 23 || 
        minute < 0 || minute > 59
    ) {
        throw new Error('Invalid time input. Use HH:MM within valid 24-hour range.');
    }
    return time;
}