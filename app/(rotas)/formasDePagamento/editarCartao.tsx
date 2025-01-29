import { Text, View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { useMyContext } from "@/components/context/appContext";
import {
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  validateCard,
} from "@/assets/utils/card";
import { Input } from "@/components/ui/input";

export default function EditCardScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const { card } = useLocalSearchParams();

  const { editCard } = useMyContext();

  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [cvc, setCvc] = useState("");
  const [isCredit, setIsCredit] = useState(true);

  useEffect(() => {
    if (card) {
      const parsedCard = JSON.parse(card as string);

      setNumero(formatCardNumber(parsedCard.number));
      setValidade(formatExpiryDate(parsedCard.expiry));
      setCvc(parsedCard.cvc);
      setNome(parsedCard.holder);

      if (parsedCard.isCredit !== undefined) {
        setIsCredit(parsedCard.isCredit);
      }
    }
  }, [card]);

  const handleEditCard = async () => {
    const isValid = validateCard({
      nome,
      numero,
      validade,
      cvc,
    });

    if (!isValid) {
      return;
    }

    const updatedCard = {
      id: Date.now(),
      number: numero,
      holder: nome,
      expiry: validade,
      cvc,
      type: detectCardType(numero),
      isCredit,
    };

    await editCard(updatedCard);
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
          Editar Cartão
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
            {numero || "**** **** **** 1234"}
          </Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>
              {nome || "NOME DO TITULAR"}
            </Text>
            <Text style={styles.cardDate}>
              {validade || "MM/AA"}
            </Text>
          </View>
          <Text style={styles.cardCVC}>CVC: {cvc || "123"}</Text>
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
        />

        <Input
          label="Número do Cartão"
          value={numero}
          onChangeText={(txt) => setNumero(formatCardNumber(txt))}
          keyboardType="number-pad"
        />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Input
              label="Data de Validade"
              value={validade}
              onChangeText={(txt) => setValidade(formatExpiryDate(txt))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Input
              label="CVC"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
        </View>

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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: "#f44" }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleEditCard}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
    marginLeft: 80,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
