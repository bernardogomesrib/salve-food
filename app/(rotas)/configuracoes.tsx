import { Text, View } from "@/components/Themed";
import { MenuItem } from "@/components/ui/MenuItem";
import { useThemeColor } from "@/components/ui/themedefiner";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";


export default function Configuracoes() {
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    const backgroundColor = useThemeColor(
        { light: "#fff", dark: "#000" },
        "background"
    );
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor }]}>


            <View style={styles.header}>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="cog" size={24} color={textColor} style={{ marginRight: 8 }} />
                    <Text style={[styles.title, { color: textColor }]}>Configurações</Text>
                </View>

            </View>









            <View style={styles.menu}>
                <MenuItem
                    icon="shield"
                    label="Segurança"
                    onPress={() => router.push("/seguranca")}
                />
                <MenuItem
                    icon="dollar"
                    label="Formas de Pagamento"
                    onPress={() => router.push("/formasDePagamento/formasDePagamento")}
                />
                <MenuItem
                    icon="bell"
                    label="Notificação"
                    onPress={() => console.log("Não implementado ainda ")}
                />
                <MenuItem
                    icon="map"
                    label="Localização"
                    onPress={() => console.log("Não implementado ainda ")}
                />
                <MenuItem
                    icon="language"
                    label="Idioma"
                    onPress={() => console.log("Não implementado ainda ")}
                />


            </View>




        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    icon: {
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    info: {
        fontSize: 14,
        marginTop: 4,
    },
    menu: {
        marginTop: 20,
    },
});
