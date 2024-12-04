import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BuscarEntrega() {
  const { codigo } = useLocalSearchParams();
  const router = useRouter();

  // Exemplo de detalhes de entrega para fins de demonstração
  const entrega = {
    descricao: 'Entrega de Sobremesas',
    status: 'Em andamento',
    destino: 'Rua Flores, 123 - Centro',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Entrega</Text>
      {codigo ? (
        <View style={styles.entrega}>
          <Text style={styles.descricao}>Código: {codigo}</Text>
          <Text style={styles.descricao}>{entrega.descricao}</Text>
          <Text style={styles.status}>Status: {entrega.status}</Text>
          <Text style={styles.destino}>Destino: {entrega.destino}</Text>
        </View>
      ) : (
        <Text style={styles.error}>Código da entrega não encontrado.</Text>
      )}
      <Text
        style={styles.voltar}
        onPress={() => router.push('/entregador')}
      >
        Voltar para Entregador
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f0f0f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entrega: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 5,
    color: 'gray',
  },
  destino: {
    marginTop: 5,
    color: 'gray',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  voltar: {
    marginTop: 20,
    color: '#007bff',
    textAlign: 'center',
  },
});
