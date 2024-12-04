import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function Historico() {
  const historico = [
    { id: '1', descricao: 'Hambúrguer para Carlos', data: '01/12/2024' },
    { id: '2', descricao: 'Sorvete para Ana', data: '30/11/2024' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Entregas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entrega}>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.data}>{item.data}</Text>
          </View>
        )}
      />
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
  data: {
    marginTop: 5,
    color: 'gray',
  },
});
