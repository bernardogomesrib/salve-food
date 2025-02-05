import { View, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Text, useThemeColor } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { pegaPedidoPeloId } from '@/api/pedido/pedido';
import { FontAwesome5 } from '@expo/vector-icons';

const StatusColors = {
  'PENDENTE': '#FFA500',
  'CONFIRMADO': '#32CD32',
  'EM_PREPARO': '#4169E1',
  'PRONTO': '#9370DB',
  'A_CAMINHO': '#FF69B4',
  'ENTREGUE': '#228B22',
  'CANCELADO': '#FF0000',
};

const StatusIcons = {
  'PENDENTE': 'clock',
  'CONFIRMADO': 'check-circle',
  'EM_PREPARO': 'utensils',
  'PRONTO': 'check-double',
  'A_CAMINHO': 'motorcycle',
  'ENTREGUE': 'flag-checkered',
  'CANCELADO': 'times-circle',
};

const UPDATE_INTERVAL = 10000;

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<string | null>(null);
  
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const cardBackgroundColor = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );

  const fetchPedido = async () => {
    try {
      const data = await pegaPedidoPeloId(Number(id));
      if (data) {
        // Verifica se o status mudou para ENTREGUE
        if (previousStatusRef.current && 
            previousStatusRef.current !== 'ENTREGUE' && 
            data.status === 'ENTREGUE') {
          // Aqui você pode adicionar uma notificação ou feedback visual
          // Por exemplo, um som ou vibração
          // Você também pode parar o polling neste ponto
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        previousStatusRef.current = data.status;
        setPedido(data);
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
    }
  };

  useEffect(() => {
    // Função inicial de carregamento
    const initialLoad = async () => {
      setLoading(true);
      await fetchPedido();
      setLoading(false);
    };

    initialLoad();

    // Configura o intervalo de atualização
    intervalRef.current = setInterval(fetchPedido, UPDATE_INTERVAL);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (pedido?.status === 'ENTREGUE' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [pedido?.status]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Pedido não encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.statusBar, { backgroundColor: StatusColors[pedido.status as keyof typeof StatusColors] || '#999' }]}>
          <FontAwesome5 
            name={StatusIcons[pedido.status as keyof typeof StatusIcons] || 'question-circle'} 
            size={24} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {pedido.status}
          </Text>
          <Text style={styles.statusSenha}>
            Senha: {pedido.senha}
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: cardBackgroundColor }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Data do Pedido</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{pedido.dataPedido}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Última Atualização</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{pedido.dataUltimaModificacao}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            <FontAwesome5 name="shopping-cart" size={18} color={textColor} /> Itens do Pedido
          </Text>
          {pedido.itens.map((item: any) => (
            <View key={item.id} style={styles.itemCard}>
              {item.item.itemImage && (
                <Image 
                  source={{ uri: item.item.itemImage }} 
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: textColor }]}>
                  {item.quantidade}x {item.item.nome}
                </Text>
                <Text style={[styles.itemDescription, { color: textColor }]}>
                  {item.item.descricao}
                </Text>
                <Text style={[styles.itemPrice, { color: textColor }]}>
                  R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: textColor }]}>Subtotal:</Text>
              <Text style={[styles.totalValue, { color: textColor }]}>
                R$ {(pedido.valorTotal - pedido.taxaEntrega).toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: textColor }]}>Taxa de Entrega:</Text>
              <Text style={[styles.totalValue, { color: textColor }]}>
                R$ {pedido.taxaEntrega.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={[styles.totalLabel, styles.finalTotalText, { color: textColor }]}>Total:</Text>
              <Text style={[styles.totalValue, styles.finalTotalText, { color: textColor }]}>
                R$ {pedido.valorTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            <FontAwesome5 name="credit-card" size={18} color={textColor} /> Pagamento
          </Text>
          <Text style={[styles.paymentText, { color: textColor }]}>
            {pedido.formaPagamento}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            <FontAwesome5 name="map-marker-alt" size={18} color={textColor} /> Endereço de Entrega
          </Text>
          <Text style={[styles.addressName, { color: textColor }]}>
            {pedido.criadoPor.firstName} {pedido.criadoPor.lastName}
          </Text>
          <Text style={[styles.addressPhone, { color: textColor }]}>
            {pedido.criadoPor.phone}
          </Text>
          <Text style={[styles.addressText, { color: textColor }]}>
            {pedido.enderecoEntrega.apelido && `${pedido.enderecoEntrega.apelido} - `}
            {pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero}
            {pedido.enderecoEntrega.complemento && `, ${pedido.enderecoEntrega.complemento}`}
          </Text>
          <Text style={[styles.addressText, { color: textColor }]}>
            {pedido.enderecoEntrega.bairro}, {pedido.enderecoEntrega.cidade} - {pedido.enderecoEntrega.estado}
          </Text>
          <Text style={[styles.addressText, { color: textColor }]}>
            CEP: {pedido.enderecoEntrega.cep}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            <FontAwesome5 name="store" size={18} color={textColor} /> Restaurante
          </Text>
          <Text style={[styles.restaurantName, { color: textColor }]}>
            {pedido.loja.nome} {pedido.loja.segmentoLoja.emoji}
          </Text>
          <Text style={[styles.restaurantDescription, { color: textColor }]}>
            {pedido.loja.descricao}
          </Text>
          <Text style={[styles.addressText, { color: textColor }]}>
            {pedido.loja.rua}, {pedido.loja.numero} - {pedido.loja.bairro}
          </Text>
          <Text style={[styles.addressText, { color: textColor }]}>
            {pedido.loja.cidade} - {pedido.loja.estado}
          </Text>
        </View>

        {pedido.entregador && (
          <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              <FontAwesome5 name="motorcycle" size={18} color={textColor} /> Entregador
            </Text>
            <Text style={[styles.deliveryText, { color: textColor }]}>
              {pedido.entregador.nome}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusSenha: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  finalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentText: {
    fontSize: 16,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  deliveryStatus: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});