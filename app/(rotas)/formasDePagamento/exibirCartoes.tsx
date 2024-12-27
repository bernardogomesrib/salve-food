import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function CardListScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const [cards, setCards] = useState([
    {
      id: "1",
      type: "VISA",
      number: "**** **** **** 1234",
      holder: "JOÃO SILVA",
      expiry: "12/25",
    },
    {
      id: "2",
      type: "MasterCard",
      number: "**** **** **** 5678",
      holder: "MARIA OLIVEIRA",
      expiry: "08/24",
    },
  ]);

  const [selectedCard, setSelectedCard] = useState<string|null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDeleteCard = (cardId: string|null) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    setModalVisible(false);
  };

  const confirmDelete = (cardId: string) => {
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5
            name="arrow-left"
            size={24}
            color={isDarkMode ? "#fff" : "#333"}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#333" }]}>
          Meus Cartões
        </Text>
      </View>

      {/* Lista de Cartões */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
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
              <FontAwesome5
                name={item.type === "VISA" ? "cc-visa" : "cc-mastercard"}
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
                Vencimento: {item.expiry}
              </Text>
            </View>
            {/* Botões de Ação */}
            <View style={styles.actionButtons}>
              <Link href={"/formasDePagamento/editarCartao"} style={styles.editButton}>
                <FontAwesome5 name="edit" size={18} color="#1f8fdb" />
              </Link>
              <TouchableOpacity
                onPress={() => confirmDelete(item.id)}
                style={styles.deleteButton}
              >
                <FontAwesome5 name="trash" size={18} color="#f44336" />
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

      {/* Modal de Confirmação */}
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
                onPress={() => handleDeleteCard(selectedCard)}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botão para Adicionar Novo Cartão */}
      <Link href={"/formasDePagamento/adicionarCartao"} style={[
          styles.addButton,
          { backgroundColor: isDarkMode ? "#222" : "orange" },
        ]}>
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
    textAlign: "center", // Centraliza o texto dentro do componente Text
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
