import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

// Stripe
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { showMessage } from "react-native-flash-message";

export default function AddCardScreenStripe() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  // Hook para confirmar pagamento
  const { confirmPayment, loading } = useConfirmPayment();

  const [clientSecret, setClientSecret] = useState<string>("");

  // Cria PaymentIntent no servidor (exemplo)
  const createPaymentIntentOnServer = async () => {
    try {
      // Faz requisição ao seu back-end
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Se for R$ 10,99 em centavos
          body: JSON.stringify({ amount: 1099 }),
        }
      );
      const data = await response.json();

      // Se seu back-end retorna { clientSecret }, capturamos:
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        showMessage({
          message: "OK",
          description: "PaymentIntent criado no servidor!",
          type: "success",
        })
      } else {
        showMessage({
          message: "Erro",
          description: "Não recebi clientSecret do back-end!",
          type: "danger",
        })
      }
    } catch (error) {
      console.error(error);
      showMessage({
        message: "Erro",
        description: "Falha ao criar PaymentIntent.",
        type: "danger",
      })
    }
  };

  // Ao pressionar "Pagar", confirma o pagamento
  const handlePayPress = async () => {
    if (!clientSecret) {
      showMessage({
        message: "Erro",
        description: "Primeiro gere o PaymentIntent (client_secret).",
        type: "warning",
      })
      return;
    }

    try {
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });

      if (error) {
        showMessage({
          message: "Erro Stripe",
          description: error.message || "Erro desconhecido",
          type: "danger",
        })
      } else if (paymentIntent) {
        showMessage({
          message: "Pagamento OK",
          description: `Status: ${paymentIntent.status}\nID: ${paymentIntent.id}`,
          type: "success",
        })
      }
    } catch (err) {
      showMessage({
        message: "Erro",
        description: "Falha ao comunicar com Stripe.",
        type: "danger",
      })
    }
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
          <FontAwesome
            name="arrow-left"
            size={24}
            color={isDarkMode ? "#fff" : "#333"}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#333" }]}>
          Adicionar Cartão (Stripe)
        </Text>
      </View>

      {/* Botão que cria PaymentIntent no servidor */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "orange" }]}
        onPress={createPaymentIntentOnServer}
      >
        <Text style={styles.buttonText}>Criar PaymentIntent</Text>
      </TouchableOpacity>

      <Text style={{ marginBottom: 10, color: isDarkMode ? "#fff" : "#333" }}>
        ClientSecret: {clientSecret || "N/A"}
      </Text>

      <View style={styles.cardFieldContainer}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: "1234 1234 1234 1234",
          }}
          //cardStyle={{
            //backgroundColor: isDarkMode ? "#222" : "#fff",
            //textColor: isDarkMode ? "#fff" : "#333",
          //}}
          style={styles.cardField}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1f8fdb", marginTop: 20 }]}
        onPress={handlePayPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processando..." : "Pagar"}
        </Text>
      </TouchableOpacity>

      <Link
        href={"/formasDePagamento/exibirCartoes"}
        style={[
          styles.button,
          {
            marginTop: 10,
            backgroundColor: isDarkMode ? "#444" : "#333",
          },
        ]}
      >
        <Text style={styles.buttonText}>Voltar / Salvar Cartão</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 80,
  },
  cardFieldContainer: {
    width: "100%",
    height: 50,
    marginVertical: 10,
  },
  cardField: {
    flex: 1,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
