import { Text, View } from "@/components/Themed";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

type Address = {
  id: string;
  label: string;
  address?: string;
  district: string;
  city: string;
  details: string;
  icon: string;
};

const addresses: Address[] = [
  {
    id: "1",
    label: "Rua São José, 83",
    district: "Nova Descoberta",
    city: "Recife/PE",
    details: "Primeiro Andar, xxxxxxxxxx",
    icon: "location-on",
  },
  {
    id: "2",
    label: "Casa",
    address: "Rua São João, 96",
    district: "Nova Descoberta",
    city: "Recife/PE",
    details: "Primeiro Andar, xxxxxxxxxx",
    icon: "home",
  },
  {
    id: "3",
    label: "Trabalho",
    address: "Rua São João, 96",
    district: "Nova Descoberta",
    city: "Recife/PE",
    details: "Primeiro Andar, xxxxxxxxxx",
    icon: "work",
  },
];

export default function ListaEnderecos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const openModal = (ad: Address) => {
    setSelectedAddress(ad);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAddress(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Endereços</Text>

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={18} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Buscar endereço e número"
        />
      </View>

      <ScrollView>
        <View>
          {addresses &&
            addresses.map((address) => (
              <View style={styles.card} key={address.id}>
                <MaterialIcons
                  name={address.icon as keyof typeof MaterialIcons.glyphMap}
                  size={24}
                  color="#000"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{address.label}</Text>
                  <Text style={styles.cardText}>{address.address}</Text>
                  <Text style={styles.cardText}>{address.district}</Text>
                  <Text style={styles.cardText}>{address.city}</Text>
                  <Text style={styles.cardText}>{address.details}</Text>
                </View>
                <TouchableOpacity onPress={() => openModal(address)}>
                  <MaterialIcons name="more-vert" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {/* Novo botão no final da lista */}
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <TouchableOpacity style={styles.buttonNewAddress}>
            <Link href="/adicionarEnderecos">
              <Text style={styles.buttonText}>Novo Endereço</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedAddress?.label}</Text>
            <View style={styles.button}>
              <TouchableOpacity style={styles.modalButtonDelete}>
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonEdit}>
                <Link href={"/editarEnderecos"}>
                  <Text style={styles.modalButtonText}>Editar</Text>
                </Link>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    marginBottom: 16,
    margin: 15,
  },
  input: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    margin: 15,
  },
  cardContent: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#f9f9f9",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  cardText: {
    color: "#555",
  },
  buttonNewAddress: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 250,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#555",
  },
  modalButtonDelete: {
    backgroundColor: "#FE251A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 8,
  },
  modalButtonEdit: {
    backgroundColor: "#FFCD03",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
});
