import { getRestaurantes, getRestaurantesNoLocation, getRestaurantesPorCategoria, getRestaurantesPorCategoriaNoLocation } from '@/api/loja/loja';
import { getCategories } from '@/api/segmentoLoja/segmento';
import { Category, Restaurant } from '@/assets/types/types';
import { useMyContext } from '@/components/context/appContext';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';



export default function Home() {
  const { restaurants, setRestaurants, handleRestaurantSelection, defineUsuario,location,enderecoSelecionadoParaEntrega } = useMyContext();
  const [pagina, setPagina] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [categoria, setCategoria] = useState<null | number>(null);
  const [categorias,setCategorias] = useState<Category[]|null>(null);
  const aoEntrar = async () => {
    defineUsuario();
    paginar();
    pegarCategorias();
  }
  const pegarCategorias = async () => {
    const resp = await getCategories();
    setCategorias(resp);
  }
  const paginar = async () => {
    setRefreshing(true);
    console.log("paginar chamado");
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showMessage({
          message: 'Permissão para pegar localização negada',
          type: 'danger',
        })
        return;
      }

      if (enderecoSelecionadoParaEntrega&&enderecoSelecionadoParaEntrega.latitude&&enderecoSelecionadoParaEntrega.longitude){
        const restaurantes = categoria !== null ? await getRestaurantesPorCategoria({ longitude: enderecoSelecionadoParaEntrega.longitude, latitude: enderecoSelecionadoParaEntrega.latitude, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 }, pagina, categoria) : await getRestaurantes({ longitude: enderecoSelecionadoParaEntrega.longitude, latitude: enderecoSelecionadoParaEntrega.latitude, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 }, pagina);
        const uniqueRestaurants = Array.from(new Set(restaurantes.map(r => r.id)))
          .map(id => restaurantes.find(r => r.id === id));
        setRestaurants(uniqueRestaurants.filter((restaurant): restaurant is Restaurant => restaurant !== undefined));
        setRefreshing(false);
      } else if (location){
        const restaurantes = categoria !==null ? await getRestaurantesPorCategoria(location.coords, pagina, categoria) : await getRestaurantes(location.coords, pagina);
        const uniqueRestaurants = Array.from(new Set(restaurantes.map(r => r.id)))
          .map(id => restaurantes.find(r => r.id === id));
        setRestaurants(uniqueRestaurants.filter((restaurant): restaurant is Restaurant => restaurant !== undefined));
        setRefreshing(false);
      }else{
        const restaurantes = categoria !==null ? await getRestaurantesPorCategoriaNoLocation(pagina, categoria) : await getRestaurantesNoLocation(pagina);
        const uniqueRestaurants = Array.from(new Set(restaurantes.map(r => r.id)))
          .map(id => restaurantes.find(r => r.id === id));
        setRestaurants(uniqueRestaurants.filter((restaurant): restaurant is Restaurant => restaurant !== undefined));
        setRefreshing(false);

      }
    } catch (error) {
      showMessage({
        message: 'Erro',
        description: 'Não foi possível obter a localização.',
        type: 'danger',
      })
    }
  }

  useEffect(() => {
    setRestaurants([]);
    setPagina(0)
    paginar();
  }, [categoria]);

  const onRefresh = () => {
    setRestaurants([]);
    setPagina(0);
    paginar();
  }


  useEffect(() => {
    if(enderecoSelecionadoParaEntrega===undefined){
      router.push('/(rotas)/listaEnderecos');
    }
    aoEntrar();
  },[])
  useEffect(()=>{
    onRefresh();
  },[enderecoSelecionadoParaEntrega]);
  useEffect(() => { paginar(); }, [pagina]);
  return (
    <View style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <TouchableOpacity style={styles.categoryCard} onPress={() => {
            setCategoria(null);
            setPagina(0);
          }}>
            <Text style={styles.categoryIcon}>{'🍽️'}</Text>

            <Text style={styles.categoryName}>Todas</Text>
          </TouchableOpacity>
          {categorias?categorias.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => {
              setCategoria(category.id);
              console.log(restaurants);
            }}>
              <Text style={styles.categoryIcon}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          )):null}
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
    flexGrow: 1,
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