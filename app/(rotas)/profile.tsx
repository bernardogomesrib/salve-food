import { Text, View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { MenuItem } from "@/components/ui/MenuItem";
import { useThemeColor } from "@/components/ui/themedefiner";
import { useRouter } from "expo-router";



export default function Profile() {
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Seu Perfil</Text>

        <FontAwesome
          name="user-circle-o"
          size={100}
          color={textColor}
          style={styles.icon}
        />
        <Text style={[styles.name, { color: textColor }]}>Lorem Ipsum</Text>
        <Text style={[styles.info, { color: textColor }]}>(81) 4002-8922</Text>
        <Text style={[styles.info, { color: textColor }]}>
          EMAIL_EXEMPLO@TESTE.COM
        </Text>
      </View>

      <View style={styles.menu}>
        <MenuItem
          icon="user"
          label="Seu Perfil"
          onPress={() => router.push("/alterarDados")}
        />
        <MenuItem
          icon="history"
          label="Histórico de pedidos"
          onPress={() => router.push("/orderHistory")}
        />
        <MenuItem
          icon="map-marker"
          label="Endereços"
          onPress={() => router.push("/listaEnderecos")}
        />
        <MenuItem
          icon="motorcycle"
          label="Área do Entregador"
          onPress={() => router.push("/entregador")}
        />
        <MenuItem
          icon="cog"
          label="Configurações"
          onPress={() => console.log("Não implementado ainda (Configurações)")}
        />
        <MenuItem
          icon="sign-out"
          label="Logout"
          onPress={() => console.log("Não implementado ainda (Logout)")}
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
