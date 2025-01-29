import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useMyContext } from "@/components/context/appContext";
import {
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  validateCard,
} from "@/assets/utils/card";
import { Input } from "@/components/ui/input";

export default function AddCardScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [cvc, setCvc] = useState("");
  
  const [isCredit, setIsCredit] = useState(true);

  const { addCard } = useMyContext();

  const handleAddCard = async () => {
    const isValid = validateCard({
      nome,
      numero,
      validade,
      cvc,
    });

    if (!isValid) return;

    const newCard = {
      id: Date.now(),
      number: numero,
      holder: nome,
      expiry: validade,
      cvc,
      type: detectCardType(numero),
      isCredit,
    };

    await addCard(newCard);
    router.push("/formasDePagamento/exibirCartoes");
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
          Novo Cartão
        </Text>
      </View>

      <View style={styles.cardPreview}>
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#333" : "#000" },
          ]}
        >
          <Text style={styles.cardNumber}>
            {numero !== "" ? numero : "**** **** **** 1234"}
          </Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>
              {nome !== "" ? nome : "NOME DO TITULAR"}
            </Text>
            <Text style={styles.cardDate}>
              {validade !== "" ? validade : "MM/AA"}
            </Text>
          </View>
          <Text style={styles.cardCVC}>CVC: {cvc !== "" ? cvc : "123"}</Text>
          <Text style={styles.cardType}>
            {isCredit ? "CRÉDITO" : "DÉBITO"}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <Input
          label="Nome do Titular"
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome do titular"
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        />

        <Input
          label="Número do Cartão"
          value={numero}
          onChangeText={(text) => setNumero(formatCardNumber(text))}
          placeholder="1234 5678 1234 5678"
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
          keyboardType="number-pad"
        />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Input
              label="Data de Validade"
              placeholder="MM/AA"
              value={validade}
              onChangeText={(text) => setValidade(formatExpiryDate(text))}
              keyboardType="numeric"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Input
              label="CVC"
              placeholder="123"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="number-pad"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              maxLength={3}
            />
          </View>
        </View>

        {/* Seletor de Crédito ou Débito */}
        <View style={styles.creditDebitContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isCredit && styles.selectedToggle]}
            onPress={() => setIsCredit(true)}
          >
            <Text style={styles.toggleButtonText}>Crédito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isCredit && styles.selectedToggle]}
            onPress={() => setIsCredit(false)}
          >
            <Text style={styles.toggleButtonText}>Débito</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: isDarkMode ? "#222" : "orange" },
          ]}
          onPress={handleAddCard}
        >
          <Text
            style={[
              styles.addButtonText,
              { color: isDarkMode ? "white" : "white" },
            ]}
          >
            Adicionar Cartão
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilizações
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 100,
  },
  cardPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    width: 300,
    height: 200,
    borderRadius: 12,
    padding: 20,
    justifyContent: "space-between",
  },
  cardNumber: {
    fontSize: 18,
    color: "#fff",
    letterSpacing: 2,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDate: {
    color: "#fff",
    fontSize: 16,
  },
  cardCVC: {
    color: "#fff",
    fontSize: 14,
    textAlign: "right",
  },
  cardType: {
    color: "#fff",
    fontSize: 14,
    alignSelf: "flex-end",
  },
  form: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    width: "48%",
  },
  creditDebitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  toggleButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  selectedToggle: {
    backgroundColor: "#ccc",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
