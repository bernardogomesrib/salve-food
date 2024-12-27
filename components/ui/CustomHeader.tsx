import { styles } from "@/assets/styles/Styles";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "../Themed";

const CustomHeader = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const color = useColorScheme();
    return (<>

        <View style={{ height: insets.top }}>
            <StatusBar style={color === 'dark' ? 'light' : 'dark'} />
        </View>
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => {
                    console.log("Vázio por enquanto");
                }}
            >
                <FontAwesome
                    name="bars"
                    size={32}
                    color={color == "dark" ? "white" : "black"}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    router.push("/home");
                }}
            >
                <Image
                    source={require("../../assets/images/salve-food.png")}
                    style={styles.logo}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    router.push("/profile");
                }}
            >
                <FontAwesome
                    name="user"
                    size={32}
                    color={color == "dark" ? "white" : "black"}
                />
            </TouchableOpacity>
        </View>
    </>
    );
};
export { CustomHeader };
