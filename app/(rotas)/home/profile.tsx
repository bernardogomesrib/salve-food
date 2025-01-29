import { doLogout } from "@/api/auth/authModule";
import { Usuario } from "@/api/auth/tokenHandler";
import { useMyContext } from "@/components/context/appContext";
import { Text, View } from "@/components/Themed";
import { MenuItem } from "@/components/ui/MenuItem";
import { useThemeColor } from "@/components/ui/themedefiner";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function Profile() {
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
   const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);
  const { getUsuario } = useMyContext();
  const router = useRouter();
  const [hide,setHide] = useState<boolean>(false);
  const fetchData = async () => {
    const u = await getUsuario(false);
    if (u !== undefined) {
       setUsuario(u);
      console.log(u.name);
    }
  }
  useFocusEffect(() => {
    fetchData();
  });
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Seu Perfil</Text>

        {usuario?.pfp===undefined||usuario?.pfp===null?<FontAwesome
          name="user-circle-o"
          size={100}
          color={textColor}
          style={styles.icon}
        />:
          <View style={{ alignItems: 'center', width: 100, height: 100, borderRadius: 50, backgroundColor: 'transparent', marginBottom: 10 }}>
          <Image
            source={{ uri: usuario?.pfp }}
            style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'transparent' }}
          />
        </View>
        }
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
