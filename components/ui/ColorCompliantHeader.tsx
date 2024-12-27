import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "../Themed";
const ColorCompliantHeader = () => {
        const insets = useSafeAreaInsets();
        const color = useColorScheme();
    return (
        <View style={{ height: insets.top }}>
            <StatusBar style={color === 'dark' ? 'light' : 'dark'} />
        </View>
    );
}
export { ColorCompliantHeader };
