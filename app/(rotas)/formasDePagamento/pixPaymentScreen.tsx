import React, { useState } from "react";
import { StyleSheet, Image, Alert } from "react-native";
import { Button } from "react-native-elements";
import * as Clipboard from "expo-clipboard";
import { Text, View } from "@/components/Themed";

export default function PixPaymentScreen() {
  const [qrCodeBase64, setQrCodeBase64] = useState<string>("");
  const [qrCodePayload, setQrCodePayload] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  async function handleCreatePayment() {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}create-pix-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 30.5,
            description: "Compra de Pizza",
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        Alert.alert("Erro", data.error);
        return;
      }

      setQrCodeBase64(data.qr_code_base64);
      setQrCodePayload(data.qr_code);
      setPaymentStatus(data.status);

      Alert.alert("Pix Gerado", "QR Code gerado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar pagamento Pix.");
      console.error(error);
    }
  }

  async function handleCopyPixCode() {
    if (qrCodePayload) {
      await Clipboard.setStringAsync(qrCodePayload);
      Alert.alert("Pix Copia e Cola", "Código Pix copiado com sucesso!");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize:20}}>Pagamento por Pix (Mercado Pago)</Text>

      <Button
        title="Gerar Pix"
        onPress={handleCreatePayment}
        buttonStyle={styles.button}
      />

      {/* Se tivermos a imagem base64 do QR Code, exibimos */}
      {qrCodeBase64 ? (
        <Image
          source={{ uri: `data:image/png;base64,${qrCodeBase64}` }}
          style={{ width: 250, height: 250, marginVertical: 20 }}
        />
      ) : (
        <Text style={{ marginTop: 20 }}>QR Code não gerado</Text>
      )}

      {qrCodePayload ? (
        <>
          <Button
            title="Copiar código Pix"
            onPress={handleCopyPixCode}
            buttonStyle={[styles.button, { backgroundColor: "#4CAF50" }]}
          />

          <Text style={styles.label}>Código Pix (copia e cola):</Text>
          <Text selectable style={styles.pixCode}>
            {qrCodePayload}
          </Text>
        </>
      ) : null}

      <Text style={styles.label}>
        Status do Pagamento: {paymentStatus || "---"}
      </Text>

      <Button
        title="Confirmar Pagamento (Simulado)"
        onPress={() => {
          Alert.alert("Simulação", "Pagamento confirmado!");
        }}
        buttonStyle={[styles.button, { backgroundColor: "#2196F3" }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#6200EE",
  },
  label: {
    marginTop: 16,
    fontWeight: "bold",
  },
  pixCode: {
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 16,
  },
});
