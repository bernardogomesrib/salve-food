import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, RelativePathString, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export type PaymentMethod = {
  icon:
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof FontAwesome5>["name"];
  title: string;
  route: RelativePathString;
  lib?: "MaterialCommunityIcons" | "FontAwesome5";
};

export default function PaymentMethodsScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const paymentMethods: PaymentMethod[] = [
    {
      icon: "credit-card",
      title: "Cartão de Crédito",
      route: "./exibirCartoes",
    },
    { icon: "credit-card", title: "Cartão de Débito", route: "./addCardScreenStripe" },
    { icon: "qrcode", title: "Pix", route: "./pixPaymentScreen" },
    {
      icon: "food-fork-drink",
      title: "Vale-Refeição",
      route: "./ValeRefeicao",
      lib: "MaterialCommunityIcons",
    },
    {
      icon: "cart",
      title: "Vale-Alimentação",
      route: "./ValeAlimentacao",
      lib: "MaterialCommunityIcons",
    },
    {
      icon: "barcode",
      title: "Boleto Bancário",
      route: "./BoletoPaymentScreen",
      lib: "MaterialCommunityIcons",
    },
    { icon: "paypal", title: "PayPal", route: "./PayPal", lib: "FontAwesome5" },
  ];

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
        <View style={styles.headerContent}>
          <FontAwesome5
            name="money-bill-wave"
            size={28}
            color={isDarkMode ? "#4CAF50" : "#1f8fdb"}
          />
          <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#333" }]}>
            Formas de Pagamento
          </Text>
        </View>
      </View>

      {/* Payment Methods */}
      <ScrollView contentContainerStyle={styles.methodsContainer}>
        {paymentMethods.map((method, index) => (
          <Link
            href={method.route}
            key={index}
            style={[
              styles.methodButton,
              {
                backgroundColor: isDarkMode ? "#222" : "#fff",
                borderColor: isDarkMode ? "#333" : "#ddd",
              },
            ]}
          >
            <View style={styles.methodContent}>
              {method.lib === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={isDarkMode ? "#4CAF50" : "#1f8fdb"}
                  style={styles.methodIcon}
                />
              ) : (
                <FontAwesome5
                  name={method.icon}
                  size={24}
                  color={isDarkMode ? "#4CAF50" : "#1f8fdb"}
                  style={styles.methodIcon}
                />
              )}
              <Text
                style={[
                  styles.methodText,
                  { color: isDarkMode ? "#fff" : "#333" },
                ]}
              >
                {method.title}
              </Text>
            </View>
          </Link>
        ))}
      </ScrollView>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  methodsContainer: {
    paddingVertical: 10,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  methodText: {
    fontSize: 16,
    fontWeight: "500",
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodIcon: {
    marginRight: 10,
  },
});
