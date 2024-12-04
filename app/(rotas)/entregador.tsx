import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export default function DeliveryDetails() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
//    console.log(currentLocation);
    if (!userInteracted) {
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
    setLoading(false);
    console.log(location);
  };

  useEffect(() => {
    getLocation();
    const interval = setInterval(getLocation, 1000);
    return () => clearInterval(interval);
  }, []);

  if (errorMsg) {
    Alert.alert('Error', errorMsg);
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude ?? -14.2578293,
          longitude: location?.coords.longitude ?? -55.3539277,
          latitudeDelta: 40,
          longitudeDelta: 40,
        }}
        region={region?region:undefined}
        onRegionChange={() => setUserInteracted(true)}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua localização"
          />
        )}
      </MapView>

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
