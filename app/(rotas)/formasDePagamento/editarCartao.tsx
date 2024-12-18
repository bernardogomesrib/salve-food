import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function EditCardScreen({ navigation }: any) {
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
          Editar Cartão
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
          <Text style={styles.cardNumber}>{numero!==""?numero:"**** **** **** 1234"}</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>{nome!==""?nome:"THYAGO SILVA"}</Text>
            <Text style={styles.cardDate}>{validade!==""?validade:"11/30"}</Text>
          </View>
          <Text style={styles.cardCVC}>CVC: {cvc!==""?cvc:"123"}</Text>
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
          placeholder="THYAGO SILVA"
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
          value={nome}
          onChangeText={(text) => setNome(text)}
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
          onChangeText={(text) => setNumero(text)}
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
              placeholder="11/30"
              value={validade}
              onChangeText={(text) => setValidade(text)}
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
              keyboardType="numeric"
              value={cvc}
              onChangeText={(text) => setCvc(text)}
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            />
          </View>
        </View>
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: "#f44" }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.confirmButton, { backgroundColor: "#4CAF50" }]}
          >
            <Link href={"/formasDePagamento/exibirCartoes"}><Text style={styles.buttonText}>Confirmar</Text></Link>
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
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
