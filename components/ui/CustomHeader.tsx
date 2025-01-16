import { styles } from "@/assets/styles/Styles";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { View } from "../Themed";

const CustomHeader = ({color, insets,router }:{color:'dark'|'light'|undefined|null,insets:any,router:Router}) => {
    
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
                    router.push("/home/profile");
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
