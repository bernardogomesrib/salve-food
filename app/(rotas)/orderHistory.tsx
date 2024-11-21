import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

export default function OrderHistory() {
    const [isDropDownOpen, setisDropDownOpen] = useState(false);

    const toggleDropdown = () => {
        setisDropDownOpen((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity>
                        <FontAwesome name="bars" size={32} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={require("../../assets/images/salve-food.png")}
                        style={styles.logo}
                    />
                    <TouchableOpacity>
                        <FontAwesome name="user" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.body}>
                <FontAwesome name="clock-o" size={32} color="#fff" />

                <Text style={styles.text}> Histórico de Pedidos </Text>
                <TouchableOpacity onPress={toggleDropdown}>
                    <FontAwesome
                        name={isDropDownOpen ? "chevron-down" : "chevron-right"}
                        size={32}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
            {isDropDownOpen && (
            <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>Pedido #1</Text>
                <Text style={styles.dropdownText}>Pedido #2</Text>
                <Text style={styles.dropdownText}>Pedido #3</Text>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    body: {
        marginTop: 30,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: "contain",
    },
    dropdown: {
        padding: 16,
        backgroundColor: "#222",
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    dropdownText: {
        color: "#fff",
        fontSize: 16,
        marginVertical: 4,
    },
});
