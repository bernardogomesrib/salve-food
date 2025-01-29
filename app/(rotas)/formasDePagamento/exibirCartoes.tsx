import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

import { formatExpiryDate, getCardIconName } from "@/assets/utils/card"; 

import { useMyContext } from "@/components/context/appContext";

export default function CardListScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  const { cards, loadCards, removeCard } = useMyContext();
  const [selectedCard, setSelectedCard] = useState<number>();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const handleDeleteCard = async (cardId: number) => {
    await removeCard(cardId);
    setModalVisible(false);
  };

  const confirmDelete = (cardId: number) => {
    setSelectedCard(cardId);
    setModalVisible(true);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#f9f9f9" },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome
            name="arrow-left"
            size={24}
            color={isDarkMode ? "#fff" : "#333"}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#333" }]}>
          Meus Cartões
        </Text>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.cardItem,
              {
                backgroundColor: isDarkMode ? "#222" : "#fff",
                borderColor: isDarkMode ? "#333" : "#ddd",
              },
            ]}
          >
            <View style={styles.cardIcon}>
              <FontAwesome
                name={getCardIconName(item.type)} 
                size={28}
                color={isDarkMode ? "white" : "black"}
              />
            </View>

            <View style={styles.cardDetails}>
              <Text
                style={[
                  styles.cardNumber,
                  { color: isDarkMode ? "#fff" : "#333" },
                ]}
              >
                {item.number}
              </Text>
              <Text
                style={[
                  styles.cardHolder,
                  { color: isDarkMode ? "#aaa" : "#666" },
                ]}
              >
                {item.holder}
              </Text>
              <Text
                style={[
                  styles.cardExpiry,
                  { color: isDarkMode ? "#aaa" : "#666" },
                ]}
              >
                Vencimento: {formatExpiryDate(item.expiry)}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <Link
                href={{
                  pathname: "/formasDePagamento/editarCartao",
                  params: { card: JSON.stringify(item) }, 
                }}
                style={styles.editButton}
              >
                <FontAwesome name="edit" size={18} color="#1f8fdb" />
              </Link>
              <TouchableOpacity
                onPress={() => confirmDelete(item.id)}
                style={styles.deleteButton}
              >
                <FontAwesome name="trash" size={18} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={[styles.emptyText, { color: isDarkMode ? "#aaa" : "#666" }]}
          >
            Nenhum cartão cadastrado.
          </Text>
        }
      />

      <Modal
        transparent
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Deseja realmente excluir este cartão?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() =>
                  selectedCard !== undefined && handleDeleteCard(selectedCard)
                }
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Link
        href="/formasDePagamento/adicionarCartao"
        style={[
          styles.addButton,
          { backgroundColor: isDarkMode ? "#222" : "orange" },
        ]}
      >
        <Text style={styles.addButtonText}>Novo Cartão</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 95 },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  cardIcon: { marginRight: 15 },
  cardDetails: { flex: 1 },
  cardNumber: { fontSize: 16, fontWeight: "bold" },
  cardHolder: { fontSize: 14 },
  cardExpiry: { fontSize: 14 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  actionButtons: { flexDirection: "row", alignItems: "center" },
  editButton: { marginRight: 10 },
  deleteButton: {},
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#aaa" },
  confirmButton: { backgroundColor: "#f44336" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
