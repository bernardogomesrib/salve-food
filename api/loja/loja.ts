import { Restaurant } from "@/components/context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LocationObjectCoords } from "expo-location";
import { Alert } from "react-native";


const getRestaurantes = async (pos: LocationObjectCoords, pagina: number) => {
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/loja?page=${pagina}&size=10&lat=${pos.latitude}&longi=${pos.longitude}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const restaur: Restaurant[] = [];
  if (response.data.content) {
    const rest = response.data.content;
    rest.forEach((element: any) => {
      restaur.push(conversor(element));
    });
    return restaur;
  } else {
    Alert.alert("Aviso", "Nenhum restaurante encontrado");
    return [];
  }
};



const getRestaurantesNoLocation = async (pagina: number) => {
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/loja?page=${pagina}&size=10`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const restaur: Restaurant[] = [];
  if (response.data.content) {
    const rest = response.data.content;
    rest.forEach((element: any) => {
      restaur.push(conversor(element));
    });
    return restaur;
  } else {
    Alert.alert("Aviso", "Nenhum restaurante encontrado");
    return [];
  }
};


const conversor = (rest:any)=>{
  const restaurant: Restaurant = {
    id: rest.id,
    name: rest.nome,
    rating: rest.rating,
    category: rest.segmentoLoja.nome,
    deliveryTime: rest.deliveryTime ? timeConversor(rest.deliveryTime) : "30 minutos",
    image: rest.image,
    description: rest.descricao,
    address: `${rest.rua}, ${rest.numero}, ${rest.bairro}, ${rest.cidade}, ${rest.estado}`,
  };
  return restaurant;
}

const timeConversor = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${Math.floor(min)}min`;
  } else {
    return `${Math.floor(min)}min`;
  }
};

export { getRestaurantes, getRestaurantesNoLocation };