import { editarEndereco, fetchAddress, handleCepLookup } from "@/api/endereco/endereco";
import { useMyContext } from "@/components/context/appContext";
import { Input } from "@/components/ui/input";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { showMessage } from "react-native-flash-message";
import MapView, { Marker } from "react-native-maps";



export default function AddAddressScreen() {

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const { location, enderecoParaEditar, setEnderecoParaEditar, modificaEndereco } = useMyContext();

  

  const handleLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showMessage({
        message: "Permissão Negada",
        description:
          "É necessário conceder permissão de localização para usar esta funcionalidade.",
        type: "danger",
      })
      return;
    }
    if (location) {
      const { latitude, longitude } = location?.coords;
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
    }

  };

  const handleSelectLocation = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
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


        {/* Formulário */}
        <View style={styles.form}>
          <Input label="Apelido" value={enderecoParaEditar.apelido} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, apelido: text })} placeholder="Ex: Casa" />
          <Input label="Rua" value={enderecoParaEditar.rua} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, rua: text })} placeholder="Ex: Av. Paulista" />
          <Input label="Número" value={enderecoParaEditar.numero} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, numero: text })} placeholder="Ex: 123" />
          <Input label="Bairro" value={enderecoParaEditar.bairro} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, bairro: text })} placeholder="Ex: Bela Vista" />
          <Input label="Cidade" value={enderecoParaEditar.cidade} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, cidade: text })} placeholder="Ex: São Paulo" />
          <Input label="Estado" value={enderecoParaEditar.estado} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, estado: text })} placeholder="Ex: SP" />
          <Input label="Complemento" value={enderecoParaEditar.complemento} onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, complemento: text })} placeholder="Ex: Apto 101" />
          <Input label="CEP" mask="cep" value={enderecoParaEditar.cep} keyboardType="numeric" onChangeText={(text) => setEnderecoParaEditar({ ...enderecoParaEditar, cep: text })} placeholder="Ex: 01311-000" />

          <TouchableOpacity style={styles.cepButton} onPress={() => { handleCepLookup(enderecoParaEditar, setEnderecoParaEditar) }}>
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

        <TouchableOpacity style={styles.saveButton} onPress={() => { modificaEndereco(editarEndereco(enderecoParaEditar));router.back() }}>

          <Text style={styles.saveButtonText}>Salvar modificação no endereço</Text>

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
              onPress={async () => {
                const response = await fetchAddress(
                  selectedLocation.latitude,
                  selectedLocation.longitude
                );
                if (response) {
                  const { addressString, components } = response;
                  setSelectedLocation({
                    ...selectedLocation,
                    address: addressString,
                  });
                  setEnderecoParaEditar({
                    ...enderecoParaEditar,
                    rua:
                      components.find((c: any) => c.types.includes("route"))?.long_name || "",
                    bairro:
                      components.find((c: any) => c.types.includes("sublocality"))
                        ?.long_name || "",
                    cidade:
                      components.find((c: any) => c.types.includes("locality"))?.long_name ||
                      "",
                    estado:
                      components.find((c: any) =>
                        c.types.includes("administrative_area_level_1")
                      )?.short_name || "",
                    pais:
                      components.find((c: any) => c.types.includes("country"))?.long_name ||
                      "",
                    cep:
                      components.find((c: any) => c.types.includes("postal_code"))
                        ?.long_name || "",
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  });
                }
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
