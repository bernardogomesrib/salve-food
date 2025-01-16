import { getRestaurantes, getRestaurantesNoLocation } from '@/api/loja/loja';
import { Restaurant, useMyContext } from '@/components/context/appContext';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

const categories = [
  { id: 1, name: 'Brasileira', icon: '🇧🇷' },
  { id: 2, name: 'Italiana', icon: '🇮🇹' },
  { id: 3, name: 'Japonesa', icon: '🇯🇵' },
  { id: 4, name: 'Fast Food', icon: '🍔' },
  { id: 5, name: 'Vegana', icon: '🥗' },
  { id: 6, name: 'Doces', icon: '🍰' },
];


export default function Home() {
  const {restaurants,setRestaurants,handleRestaurantSelection,defineUsuario} = useMyContext();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pagina, setPagina] = useState(0);
  const aoEntrar = async ()=>{
    defineUsuario();
    paginar();
  }
  const paginar = async ()=>{

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão para pegar localização negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const restaurantes = await getRestaurantes(location.coords, pagina);
    const uniqueRestaurants = Array.from(new Set(restaurantes.map(r => r.id)))
      .map(id => restaurantes.find(r => r.id === id));
    setRestaurants(uniqueRestaurants.filter((restaurant): restaurant is Restaurant => restaurant !== undefined));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
      getRestaurantesNoLocation(pagina).then((res)=>{
        const uniqueRestaurants = Array.from(new Set(res.map(r => r.id)))
          .map(id => res.find(r => r.id === id));
        setRestaurants(uniqueRestaurants.filter((restaurant): restaurant is Restaurant => restaurant !== undefined));
      });
    }
  }
  const toSet = ()=>{
    const lista = ["Churrascarias", "Pizzarias", "Hamburguerias", "Pastelarias", "Sorveterias", "Confeitarias", "Padarias Gourmet", "Frutos do Mar", "Sopas e Caldos", "Lanchonetes", "Creperias", "Veganos", "Vegetarianos", "Sem Glúten", "Sem Lactose", "Orgânicos", "Comida Fitness", "Infantil", "Gourmet", "Low Carb/Keto", "Fast Food", "Italiana", "Japonesa", "Chinesa", "Brasileira", "Mexicana", "Árabe", "Indiana", "Francesa", "Tailandesa", "Coreana", "Mediterrânea", "Espanhola", "Alemã", "Portuguesa", "Peruana", "Americana", "Africana", "Turca", "Vietnamita", "Australiana ", "Churrascarias", "Pizzarias", "Hamburguerias", "Pastelarias", "Sorveterias", "Confeitarias", "Padarias Gourmet", "Frutos do Mar", "Sopas e Caldos", "Lanchonetes", "Creperias", "Nordestina", "Mineira", "Gaúcha", "Amazônica", "Étnica"]
    const uniqueSet = new Set(lista);
    console.log(uniqueSet);
  }

  useState(() => {
    aoEntrar();
  })
  useState(()=>{paginar(),[pagina]});
  return (
    <View style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => {
              toSet();
              console.log(restaurants);
            }}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Restaurantes</Text>
        {restaurants.map((restaurante) => (
          <TouchableOpacity
          key={restaurante.id}
          style={styles.restaurantCard}
          onPress={() => handleRestaurantSelection(restaurante)}
        >
            <Image
              source={restaurante.image}
              style={styles.restaurantImage}
              contentFit="cover"
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurante.name}</Text>
              <View style={styles.restaurantDetails}>
                <Text style={styles.rating}>⭐ {restaurante.rating}</Text>
                <Text style={styles.category}>{restaurante.category}</Text>
                <Text style={styles.deliveryTime}>🕒 {restaurante.deliveryTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#AEADAD',
    padding: 15,
    borderRadius: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
});