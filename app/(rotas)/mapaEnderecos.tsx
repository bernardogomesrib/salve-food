import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressPreview, setAddressPreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
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

      setLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
    fetchAddress(newRegion.latitude, newRegion.longitude);
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDohZlFgwg979AR1ndE_7eud9z7duRZ2GI`
      );
      const data = await response.json();

      if (!data.results.length) {
        setAddressPreview("Endereço não encontrado.");
        return;
      }

      const address = data.results[0].formatted_address;
      setAddressPreview(address);
      setSelectedLocation({ latitude, longitude, address });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o endereço.");
    }
  };

  const extractAddressParts = (fullAddress) => {
    const parts = fullAddress.split(",");

    const rua = parts[0]?.trim() || "";
    const numeroBairro = parts[1]?.split("-") || [];
    const numero = numeroBairro[0]?.trim() || "";
    const bairro = numeroBairro[1]?.trim() || ""; 

    const cidadeEstadoCep = parts[2]?.split("-") || [];
    const cidade = cidadeEstadoCep[0]?.trim() || "";
    const estado = cidadeEstadoCep[1]?.trim() || "";
    const cep = parts[3]?.trim() || "";

    const pais = parts[4]?.trim() || "";

    return {
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      pais,
    };
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      const addressParts = extractAddressParts(selectedLocation.address);
      const callbackData = {
        rua: addressParts.rua,
        numero: addressParts.numero,
        bairro: addressParts.bairro,
        cidade: addressParts.cidade,
        estado: addressParts.estado,
        cep: addressParts.cep,
        pais: addressParts.pais,
      };

      console.log("Callback Data", callbackData);

      router.back();
      
  //     router.push({
  //       pathname: "/adicionarEnderecos",
  //       query: {
  //         callbackData: JSON.stringify(callbackData),
  //       },
  //     });
  //   } else {
  //     Alert.alert("Erro", "Nenhum local selecionado.");
  //   }
  // };

  if (!region) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
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
      <View style={styles.preview}>
        <Text style={styles.previewText}>
          {addressPreview || "Mova o mapa para selecionar um local."}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmLocation}
      >
        <Text style={styles.confirmButtonText}>Confirmar Localização</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#1f8fdb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
