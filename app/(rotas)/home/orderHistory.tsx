import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor, View } from "@/components/Themed";
import { Pedido } from "@/assets/types/types";
import { pegaPedidos } from "@/api/pedido/pedido";

export default function OrderHistory() {
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const [pagina, setPagina] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const paginaPedidos = async () => {
    if (pagina > totalPage) {
      return;
    }
    const pedidos = await pegaPedidos(pagina, setTotalPage);

    const updatedOrders = pedidos.map((pedido: any) => {
      const existingOrderIndex = orders.findIndex(order => order.id === pedido.id);
      if (existingOrderIndex !== -1) {
        orders[existingOrderIndex] = pedido;
        return null;
      }
      return pedido;
    }).filter((pedido: any) => pedido !== null);

    setOrders([...orders, ...updatedOrders]);

  }
  useEffect(() => {
    paginaPedidos();
  }, [pagina]);
  useEffect(() => { console.log("foi alterado a quantidade de paginas total") }, [totalPage])

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          Histórico de Pedidos
        </Text>
      </View>
     
      <ScrollView>
        {orders.length > 0 ? (
          orders.map((item: any) => {
            console.log(item.itens);
            return (
              <View key={item.id} style={[styles.orderCard, { backgroundColor }]}>
                <Text style={[styles.orderHeader, { color: textColor }]}>
                  Pedido #{item.id} - {item.status}
                </Text>
                <Text style={[styles.orderHeader, { color: textColor }]}>
                  Senha: {item.senha}
                </Text>
                <Text style={[styles.orderText, { color: textColor }]}>
                  Data: {item.dataPedido}
                </Text>
                <Text style={[styles.orderText, { color: textColor }]}>
                  Total: R${item.valorTotal.toFixed(2)} (Taxa de Entrega: {item.taxaEntrega.toFixed(2)})
                </Text>
                <Text style={[styles.orderText, { color: textColor }]}>
                  Pagamento: {item.formaPagamento}
                </Text>
                <Text style={[styles.subHeader, { color: textColor }]}>Itens:</Text>
                {item.itens && item.itens.map((it: any) => (
                  <Text
                    key={it.id}
                    style={[styles.orderText, { color: textColor }]}
                  >
                    - {it.quantidade}x {it.item.nome} (R${(it.quantidade * it.valorUnitario).toFixed(2)})
                  </Text>
                ))}
                <Text style={[styles.subHeader, { color: textColor }]}>
                  Endereço:
                </Text>
                <Text style={[styles.orderText, { color: textColor }]}>
                  {item.criadoPor.firstName + " " + item.criadoPor.lastName}, {item.enderecoEntrega.apelido ? item.enderecoEntrega.apelido : item.enderecoEntrega.rua},{" "}
                  {item.enderecoEntrega.numero}, {item.enderecoEntrega.bairro},{" "}
                  {item.enderecoEntrega.cidade} - {item.enderecoEntrega.estado}
                </Text>
                <Text style={[styles.subHeader, { color: textColor }]}>
                  Restaurante:
                </Text>
                <Text style={[styles.orderText, { color: textColor }]}>
                  {item.loja?.nome}, {item.loja?.rua} - {item.loja?.bairro} - {item.loja?.cidade}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyMessage}>Nenhum pedido encontrado.</Text>
        )}
      </ScrollView>

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
