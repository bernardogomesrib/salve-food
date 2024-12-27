import { StatusBar } from "expo-status-bar";
import { View } from "../Themed";
const ColorCompliantHeader = ({insets, color}:{insets:any,color:any}) => {
      
    return (
        <View style={{ height: insets.top }}>
            <StatusBar style={color === 'dark' ? 'light' : 'dark'} />
        </View>
    );
}
export { ColorCompliantHeader };
