import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);

  // Função para buscar o endereço via ViaCEP
  const handleCepLookup = async () => {
    if (!address.cep) {
      Alert.alert("Erro", "Digite um CEP válido.");
      return;
    }
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${address.cep}/json/`
      );
      const data = await response.json();
      if (data.erro) {
        Alert.alert("Erro", "CEP não encontrado.");
        return;
      }

      setAddress({
        ...address,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
        pais: "Brasil",
        cep: data.cep || "",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    }
  };

  const handleLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão Negada",
        "É necessário conceder permissão de localização para usar esta funcionalidade."
      );
      return;
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = userLocation.coords;

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setSelectedLocation({
      latitude,
      longitude,
    });

    setModalVisible(true);
  };

  const handleSelectLocation = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
  };

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDohZlFgwg979AR1ndE_7eud9z7duRZ2GI`
      );
      const data = await response.json();
      if (!data.results.length) {
        Alert.alert("Erro", "Endereço não encontrado.");
        return;
      }

      const components = data.results[0].address_components;
      const addressString = data.results[0].formatted_address;

      setAddress({
        ...address,
        rua: components.find((c:any) => c.types.includes("route"))?.long_name || "",
        bairro:
          components.find((c:any) => c.types.includes("sublocality"))?.long_name ||
          "",
        cidade:
          components.find((c:any) => c.types.includes("locality"))?.long_name || "",
        estado:
          components.find((c:any) =>
            c.types.includes("administrative_area_level_1")
          )?.short_name || "",
        pais:
          components.find((c:any) => c.types.includes("country"))?.long_name || "",
        cep:
          components.find((c:any) => c.types.includes("postal_code"))?.long_name ||
          "",
      });

      setSelectedLocation({
        ...selectedLocation,
        address: addressString,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o endereço.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "black" : "#f9f9f9" },
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

      {/* Modal de Mapa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Exibindo o mapa com a região do usuário */}
            <MapView
              style={styles.map}
              region={region}
              onPress={(e) =>
                handleSelectLocation(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude
                )
              }
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                />
              )}
            </MapView>

            {/* Pré-visualização do endereço selecionado */}
            <View style={styles.preview}>
              <Text style={styles.previewText}>
                {selectedLocation && selectedLocation.address
                  ? `Local Selecionado: ${selectedLocation.address}`
                  : "Mova o mapa para selecionar um local."}
              </Text>
            </View>

            {/* Botões para confirmar ou fechar o modal */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                fetchAddress(
                  selectedLocation.latitude,
                  selectedLocation.longitude
                );
                setModalVisible(false);
              }}
            >
              <Text style={styles.confirmButtonText}>
                Confirmar Localização
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}> [ X ]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  map: { flex: 1 },
  preview: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  previewText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: "#ff4040",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
