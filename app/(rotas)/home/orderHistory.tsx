import React from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor, View } from "@/components/Themed";

export default function OrderHistory() {
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );

  const orders = [
    {
      id: 1,
      date: "03/01/2025",
      time: "18:45",
      status: "Entregue",
      total: "R$ 59,90",
      paymentMethod: "Cartão de Crédito",
      deliveryFee: "R$ 5,00",
      items: [
        { name: "Pizza de Calabresa", quantity: 1, unitPrice: "R$ 39,90" },
        { name: "Coca-Cola 2L", quantity: 1, unitPrice: "R$ 15,00" },
      ],
      address: {
        recipient: "João Silva",
        street: "Av. Principal",
        number: 123,
        city: "Pernambuco",
        neighborhood: "Recife",
        reference: "Próximo ao Marco Zero",
      },
      restaurant: {
        name: "Pizzaria Salve Food",
        address: "Rua 01, do lado da rua 02, 10, Recife",
        phone: "(81) 1234-5678",
      },
    },
    {
        id: 2,
        date: "25/12/2024",
        time: "17:10",
        status: "Entregue",
        total: "R$ 150,93",
        paymentMethod: "Cartão de Débito",
        deliveryFee: "R$ 7,00",
        items: [
          { name: "Chocotone balduco", quantity: 1, unitPrice: "R$ 80,93" },
          { name: "Vinho Branco", quantity: 1, unitPrice: "R$ 63,00" },
        ],
        address: {
          recipient: "João Silva",
          street: "Av. Principal",
          number: 123,
          city: "Pernambuco",
          neighborhood: "Recife",
          reference: "Próximo ao Marco Zero",
        },
        restaurant: {
          name: "Atacadão",
          address: "Rua 04, 540, Jaboatão",
          phone: "(81) 2345-6789",
        },
      },
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          Histórico de Pedidos
        </Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.orderCard, { backgroundColor }]}>
            <Text style={[styles.orderHeader, { color: textColor }]}>
              Pedido #{item.id} - {item.status}
            </Text>
            <Text style={[styles.orderText, { color: textColor }]}>
              Data: {item.date} às {item.time}
            </Text>
            <Text style={[styles.orderText, { color: textColor }]}>
              Total: {item.total} (Taxa de Entrega: {item.deliveryFee})
            </Text>
            <Text style={[styles.orderText, { color: textColor }]}>
              Pagamento: {item.paymentMethod}
            </Text>
            <Text style={[styles.subHeader, { color: textColor }]}>Itens:</Text>
            {item.items.map((product, index) => (
              <Text
                key={index}
                style={[styles.orderText, { color: textColor }]}
              >
                - {product.quantity}x {product.name} ({product.unitPrice})
              </Text>
            ))}
            <Text style={[styles.subHeader, { color: textColor }]}>
              Endereço:
            </Text>
            <Text style={[styles.orderText, { color: textColor }]}>
              {item.address.recipient}, {item.address.street},{" "}
              {item.address.number}, {item.address.neighborhood},{" "}
              {item.address.city} - {item.address.reference}
            </Text>
            <Text style={[styles.subHeader, { color: textColor }]}>
              Restaurante:
            </Text>
            <Text style={[styles.orderText, { color: textColor }]}>
              {item.restaurant.name}, {item.restaurant.address} - Tel:{" "}
              {item.restaurant.phone}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyMessage, { color: textColor }]}>
            Nenhum pedido encontrado.
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  orderCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
  orderText: {
    fontSize: 14,
    marginBottom: 4,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
