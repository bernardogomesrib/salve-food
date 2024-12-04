import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Button } from 'react-native';
// import { useRouter } from 'next/router';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';''
import * as Location from 'expo-location';
import Historico from './historico';
import EntregasAtivas from './entregasAtivas';
import Profile from './profile';
import { router } from 'expo-router';

export default function DeliveryDetails() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  if (errorMsg) {
    Alert.alert('Error', errorMsg);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 0,
          longitude: location ? location.longitude : 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Sua localização"
          />
        )}
      </MapView>

        {/* Botões de navegação */}
        <View style={styles.navigationContainer}>
          <View style={styles.navigationButton}>
            <Button
              title="Entregas Ativas"
              onPress={() => router.push('/entregasAtivas')}
            />
          </View>
          <View style={styles.navigationButton}>
            <Button
              title="Histórico"
              onPress={() => router.push('/historico')}
            />
          </View>
          <View style={styles.navigationButton}>
            <Button
              title="Editar Perfil"
              onPress={() => router.push('/profile')}
            />
          </View>
      </View>
      

      {/* Informações do pedido */}
      <View style={styles.card}>
        <Text style={styles.title}>Rota de Entrega</Text>
        <TouchableOpacity style={styles.liveButton}>
          <Text style={styles.liveText}>Iniciar</Text>
        </TouchableOpacity>
        <Text style={styles.subTitle}>Entrega para:</Text>
        <Text style={styles.info}>Fulano de Tal</Text>
        <Text style={styles.subTitle}>Entrega ID:</Text>
        <Text style={styles.info}>#D45FT564G90</Text>
        <Text style={styles.subTitle}>Endereço:</Text>
        <Text style={styles.info}>Rua das Flores, 123</Text>

       {/* Lista de itens - lembrar de por para pescar o titulo do restaurante na entrega */}
       <View style={styles.itemList}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>Comedoria - Gildo Lanches --- Um comido e um bebido!</Text>
            <Text style={styles.itemPrice}>R$25.59</Text>
          </View>
        </View>
      </View>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  itemList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  map: {
    height: 250,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#000',
  },
  liveButton: {
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  liveText: {
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  navigationButton: {
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 5,
  },
});

