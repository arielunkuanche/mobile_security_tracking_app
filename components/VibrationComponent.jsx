import { Vibration, SafeAreaView, Text, View } from "react-native";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const VibrationComponent = () => {
    const timeRange = useSelector((state) => state.timeRange);

    const ONE_SECOND_IN_MS = 1000; // Vibrate for 1 second

    const PATTERN = [
        1 * ONE_SECOND_IN_MS,
        2 * ONE_SECOND_IN_MS,
        3 * ONE_SECOND_IN_MS,
    ];

    useEffect(() => {
        if (timeRange) {
            Vibration.vibrate(PATTERN, true); 
        }
    }, [timeRange]);

    return (
        <SafeAreaView>
            <Text>Vibration Component</Text>
            <Button
            title="Stop vibration pattern"
            onPress={() => Vibration.cancel()}
            color="#FF0000"
            />
        </SafeAreaView>
    );
};

export default VibrationComponent;