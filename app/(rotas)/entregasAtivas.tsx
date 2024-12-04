import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function EntregasAtivas() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const entregas = [
    {
      id: '1',
      descricao: 'Entrega de Sushi para João',
      status: 'Em andamento',
      atividades: ['Preparar sushi', 'Embalar pedido', 'Entregar ao cliente'],
    },
    {
      id: '2',
      descricao: 'Pizza para Maria',
      status: 'Aguardando Retirada',
      atividades: ['Preparar pizza', 'Embalar pedido', 'Aguardar retirada'],
    },
  ];

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entregas Ativas</Text>
      <FlatList
        data={entregas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <View style={styles.entrega}>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text style={styles.status}>{item.status}</Text>
              {expanded[item.id] && (
                <FlatList
                  data={item.atividades}
                  keyExtractor={(atividade, index) => index.toString()}
                  renderItem={({ item: atividade }) => (
                    <Text style={styles.atividade}>{atividade}</Text>
                  )}
                />
              )}
            </View>
          </TouchableOpacity>
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
    color: '#fff',
  },
  entrega: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#1f1f1f',
    borderRadius: 5,
  },
  descricao: {
    fontSize: 18,
    color: '#fff',
  },
  status: {
    fontSize: 14,
    color: '#aaa',
  },
  atividade: {
    fontSize: 12,
    color: '#ccc',
    marginLeft: 10,
  },
});