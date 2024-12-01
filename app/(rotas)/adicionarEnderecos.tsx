import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

type Address = {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  complemento: string;
  cep: string;
};

export default function AddAddressScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const [address, setAddress] = useState<Address>({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "",
    complemento: "",
    cep: "",
  });

  const handleCepLookup = async () => {
    if (!address.cep) {
      Alert.alert("Erro", "Digite um CEP válido.");
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address.cep}&key=AIzaSyDohZlFgwg979AR1ndE_7eud9z7duRZ2GI`
      );
      const data = await response.json();
      if (!data.results.length) {
        Alert.alert("Erro", "CEP não encontrado.");
        return;
      }

      const components = data.results[0].address_components;
      setAddress({
        ...address,
        rua: components.find((c) => c.types.includes("route"))?.long_name || "",
        bairro:
          components.find((c) => c.types.includes("sublocality"))?.long_name ||
          "",
        cidade:
          components.find((c) => c.types.includes("locality"))?.long_name || "",
        estado:
          components.find((c) =>
            c.types.includes("administrative_area_level_1")
          )?.short_name || "",
        pais:
          components.find((c) => c.types.includes("country"))?.long_name || "",
        cep:
          components.find((c) => c.types.includes("postal_code"))?.long_name ||
          "",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    }
  };

  const handleLocation = () => {
    router.push({
      pathname: "/mapaEnderecos",
      query: { callbackData: JSON.stringify(address) },
    });
  };

  useEffect(() => {
    if (router.query && router.query.callbackData) {
      const callbackData = JSON.parse(router.query.callbackData as string);
      const { rua, bairro, cidade, estado, pais, cep, numero } =
        callbackData || {};

      setAddress((prev) => ({
        ...prev,
        rua: rua || prev.rua,
        bairro: bairro || prev.bairro,
        cidade: cidade || prev.cidade,
        estado: estado || prev.estado,
        pais: pais || prev.pais,
        cep: cep || prev.cep,
        numero: numero || prev.numero,
      }));
    }
  }, [router.query]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#121212" : "#f9f9f9" },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5
              name="arrow-left"
              size={24}
              color={isDarkMode ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#333" }]}>
            Novo Endereço
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {[
            { label: "Rua", key: "rua" },
            { label: "Número", key: "numero" },
            { label: "Bairro", key: "bairro" },
            { label: "Cidade", key: "cidade" },
            { label: "Estado", key: "estado" },
            { label: "País", key: "pais" },
            { label: "Complemento (Opcional)", key: "complemento" },
            { label: "CEP", key: "cep" },
          ].map((field, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#333" }]}
              >
                {field.label}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode ? "#222" : "#fff",
                    color: isDarkMode ? "#fff" : "#333",
                  },
                ]}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={address[field.key as keyof Address]}
                onChangeText={(text) =>
                  setAddress({ ...address, [field.key as keyof Address]: text })
                }
                keyboardType={
                  field.key === "cep" || field.key === "numero"
                    ? "numeric"
                    : "default"
                }
              />
            </View>
          ))}

          <TouchableOpacity style={styles.cepButton} onPress={handleCepLookup}>
            <Text style={styles.cepButtonText}>Buscar pelo CEP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.locationButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleLocation}
          >
            <Text style={styles.locationButtonText}>
              Usar Localização Atual
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Link href={"/listaEnderecos"}>
            <Text style={styles.saveButtonText}>Salvar novo endereço</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20 },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  form: { marginVertical: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5 },
  input: { padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  cepButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1f8fdb",
    alignItems: "center",
    marginVertical: 10,
  },
  cepButtonText: { color: "#fff", fontWeight: "bold" },
  locationButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  locationButtonText: { color: "#fff", fontWeight: "bold" },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#1f8fdb",
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
