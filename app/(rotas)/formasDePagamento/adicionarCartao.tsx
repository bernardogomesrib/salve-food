import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function AddCardScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [saveCard, setSaveCard] = useState(false);
  const router = useRouter();
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [cvc, setCvc] = useState("");

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

      {/* Card Preview */}
      <View style={styles.cardPreview}>
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#333" : "#000" },
          ]}
        >
          <Text style={styles.cardNumber}>{numero !== "" ? numero : "**** **** **** 1234"}</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>{nome !== "" ? nome : "THYAGO SILVA"}</Text>
            <Text style={styles.cardDate}>{validade !== "" ? validade : "11/30"}</Text>
          </View>
          <Text style={styles.cardCVC}>CVC: {cvc !== "" ? cvc : "123"}</Text>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#333" }]}>
          Nome do Titular
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#222" : "#fff",
              color: isDarkMode ? "#fff" : "#333",
            },
          ]}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome do titular"
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        />

        <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#333" }]}>
          Número do Cartão
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#222" : "#fff",
              color: isDarkMode ? "#fff" : "#333",
            },
          ]}
          placeholder="1234 5678 1234 5678"
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text
              style={[styles.label, { color: isDarkMode ? "#fff" : "#333" }]}
            >
              Data de Validade
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#222" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                },
              ]}
              placeholder="MM/AA"
              value={validade}
              onChangeText={setValidade}
              keyboardType="numeric"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text
              style={[styles.label, { color: isDarkMode ? "#fff" : "#333" }]}
            >
              CVC
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#222" : "#fff",
                  color: isDarkMode ? "#fff" : "#333",
                },
              ]}
              placeholder="123"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="numeric"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            />
          </View>
        </View>

        {/* Save Card Checkbox */}
        <View style={styles.checkboxContainer}>
          <Switch
            value={saveCard}
            onValueChange={setSaveCard}
            thumbColor={isDarkMode ? "#4CAF50" : "#1f8fdb"}
            trackColor={{ false: "#767577", true: "#4CAF50" }}
          />
          <Text
            style={[
              styles.checkboxLabel,
              { color: isDarkMode ? "#fff" : "#333" },
            ]}
          >
            Salvar informações do cartão
          </Text>
        </View>

        {/* Add Card Button */}
        <Link
          href={"/formasDePagamento/exibirCartoes"}
          style={[
            styles.addButton,
            { backgroundColor: isDarkMode ? "#222" : "orange" },
          ]}
        >
          <Text style={[styles.addButtonText,
          { color: isDarkMode ? "white" : "white" },]
          }>Adicionar Cartão</Text>
        </Link>
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
    marginLeft: 100,
  },
  cardPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    width: 300,
    height: 180,
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
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    width: "48%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
