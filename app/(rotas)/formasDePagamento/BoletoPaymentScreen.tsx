import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

export default function BoletoPaymentScreen() {
  const [amount, setAmount] = useState("40.0");
  const [description, setDescription] = useState("Compra de Tênis");
  const [firstName, setFirstName] = useState("Thyago");
  const [lastName, setLastName] = useState("Silva");
  const [email, setEmail] = useState("thyago.smm@gmail.com");
  const [cpf, setCpf] = useState("14097426443");
  const [boletoLink, setBoletoLink] = useState<string>("");
  const [barcode, setBarcode] = useState<string>("");

  async function handleCreateBoleto() {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}create-boleto-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            description,
            firstName,
            lastName,
            email,
            cpf,
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        Alert.alert("Erro", data.error);
        return;
      }
      setBoletoLink(data.boleto_link || "");
      setBarcode(data.barcode || "");

      Alert.alert(
        "Boleto Gerado",
        `Status: ${data.status}\n` +
          `Detalhe: ${data.status_detail}\n` +
          (data.boleto_link ? `Link: ${data.boleto_link}` : "")
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao criar boleto no servidor.");
    }
  }

  function handleOpenBoletoLink() {
    if (!boletoLink) {
      Alert.alert("Info", "Link do boleto não disponível.");
      return;
    }
    Linking.openURL(boletoLink);
  }

  async function handleCopyBarcode() {
    if (!barcode) {
      Alert.alert("Info", "Código de barras não disponível.");
      return;
    }
    await Clipboard.setStringAsync(barcode);
    Alert.alert(
      "Copiado",
      "O código de barras foi copiado para a área de transferência."
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dados do Pagador:</Text>

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Primeiro Nome</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Último Nome</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        placeholder="Ex: 12345678909"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateBoleto}>
        <Text style={styles.buttonText}>Gerar Boleto</Text>
      </TouchableOpacity>

      {/* Exibir o botão de baixar o PDF do boleto */}
      {(boletoLink || barcode) && (
        <View style={styles.boletoBox}>
          {/* Link do boleto */}
          {boletoLink ? (
            <>
              <TouchableOpacity
                style={styles.subButton}
                onPress={handleOpenBoletoLink}
              >
                <Text style={styles.subButtonText}>Abrir Boleto</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4CAF50",
    marginTop: 20,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  boletoBox: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  link: {
    color: "blue",
    marginTop: 8,
  },
  barcode: {
    color: "#333",
    marginTop: 8,
  },
  subButton: {
    backgroundColor: "#2196F3",
    marginTop: 10,
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  subButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  info: {
    marginTop: 12,
    fontStyle: "italic",
  },
});
