import { Usuario } from "@/api/auth/tokenHandler";
import { useMyContext } from "@/components/context/appContext";
import { Text, View } from "@/components/Themed";
import { MenuItem } from "@/components/ui/MenuItem";
import { useThemeColor } from "@/components/ui/themedefiner";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function Profile() {
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);
  const { getUsuario,logout } = useMyContext();
  const router = useRouter();

  const fetchData = async () => {
    const usuario = await getUsuario(true);
    if (usuario !== undefined) {
      setUsuario(usuario);
    }
  }
  useEffect(() => {
    fetchData();
  });
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Seu Perfil</Text>

        <FontAwesome
          name="user-circle-o"
          size={100}
          color={textColor}
          style={styles.icon}
          onPress={() => {fetchData}}
        />
        <Text style={[styles.name, { color: textColor }]}>{usuario ? usuario.name : "carregando..."}</Text>
        <Text style={[styles.info, { color: textColor }]}>{usuario ? usuario.phone : "carregando..."}</Text>
        <Text style={[styles.info, { color: textColor }]}>
          {usuario ? usuario.email : "carregando..."}
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
          onPress={() => router.push("/home/orderHistory")}
        />
        <MenuItem
          icon="map-marker"
          label="Endereços"
          onPress={() => router.push("/listaEnderecos")}
        />
        <MenuItem
          icon="cog"
          label="Configurações"
          onPress={() => router.push("/configuracoes")}
        />
        <MenuItem
          icon="sign-out"
          label="Logout"
          onPress={() => logout()}
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
