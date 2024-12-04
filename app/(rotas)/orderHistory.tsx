import { Text, View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

export default function OrderHistory() {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const stars = Array(5).fill("star");
    const toggleDropdown = () => {
        setIsDropDownOpen((prev) => !prev);
    };

    return (
        <View style={styles.container}>

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
                    <View style={styles.dropdownText}>
                        <View>
                            <Text>Dom 14 abril 2024</Text>
                            <View style={styles.container_order}>
                                <View style={styles.container_retaurant}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "95%", padding: 12, borderBottomWidth: 1, borderBottomColor: "7a7a7a" }}>
                                        <View style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", flexDirection: "row", }}>
                                            <Image style={styles.restaurantImage}
                                                source={{
                                                    uri: 'https://www.designi.com.br/images/preview/10802428.jpg',
                                                }} />
                                            <Text style={{ marginLeft: 12 }}>Luigi da Massa</Text>
                                        </View>
                                        <FontAwesome
                                            name={"chevron-right"}
                                            size={32}
                                            color="#black"
                                            style={{}} />
                                    </View>
                                    <View style={{ padding: 0, width:"95%", borderBottomWidth: 1, borderBottomColor: "7a7a7a", paddingVertical:5 }}>
                                        <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }}>
                                            <FontAwesome
                                                name={"check-circle"}
                                                size={32}
                                                color="#42CF1D"
                                                style={{ marginLeft: 12 }} />
                                            <Text style={{ marginLeft: 12 }}>Pedido concluído - N° 123456</Text>
                                        </View>
                                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row", }}>
                                            <Text style={{ marginLeft: 12 }}>1</Text>
                                            <Text style={{ marginLeft: 12 }}>Pizza de calabresa/borda recheada - grande</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: "95%", borderBottomWidth: 1,
                                        borderBottomColor: "7a7a7a",
                                        paddingVertical:10
                                    }}>
                                        <Text style={{ fontWeight: "bold", marginLeft:12 }}>Avaliação</Text>
                                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                            {stars.map((star, index) => (
                                                <FontAwesome
                                                    key={index}
                                                    name={star}
                                                    size={18}
                                                    color="#FFEE03"
                                                    style={styles.star}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <View style={{ paddingVertical: 8, margin: 5 }}>
                                        <Text style={{ fontWeight: "bold", color: "red", fontSize: 12 }}>Repetir Pedido</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
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
    restaurantImage: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    container_retaurant: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "100%",
        boxShadow: "0 0 10 0 ",
        marginLeft: 18
    },
    container_order: {
        display: "flex",
        width: "90%",
        paddingTop: 5,
        paddingBottom: 32
    },
    star: {
        padding: 0,

    }
});
