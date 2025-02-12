import { Restaurant } from "@/assets/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LocationObjectCoords } from "expo-location";
import { Alert } from "react-native";
import { showMessage } from "react-native-flash-message";

const getRestaurantes = async (
  pos: LocationObjectCoords,
  pagina: number,
  setMaxPage: (max: number) => void
) => {
  console.log(
    "pegando independente de categoria com localização",
    pos.latitude,
    pos.longitude
  );
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
    setMaxPage(response.data.totalPages);
    rest.forEach((element: any) => {
      restaur.push(conversor(element));
    });
    return restaur;
  } else {
    Alert.alert("Aviso", "Nenhum restaurante encontrado");
    return [];
  }
};

const getRestaurantesNoLocation = async (pagina: number,
  setMaxPage: (max: number) => void) => {
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
    setMaxPage(response.data.totalPages);
    showMessage({
      message: "Erro",
      description: "Não pode procurar lojas sem um endereço!",
      type: "warning",
    });
    return restaur;
  } else {
    Alert.alert("Aviso", "Nenhum restaurante encontrado");
    return [];
  }
};

const getRestaurantesPorCategoria = async (
  pos: LocationObjectCoords,
  pagina: number,
  categoria: number,
  setMaxPage: (max: number) => void
) => {
  console.log("pegando via categoria com localização",pos.latitude,pos.longitude);
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/loja/segmento/${categoria}?page=${pagina}&size=10&lat=${pos.latitude}&longi=${pos.longitude}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const restaur: Restaurant[] = [];
  if (response.data.content) {
    const rest = response.data.content;
    setMaxPage(response.data.totalPages);
    rest.forEach((element: any) => {
      restaur.push(conversor(element));
    });
    setMaxPage(response.data.totalPages);
    return restaur;
  } else {
    showMessage({
          message: "Erro",
          description: "Nenhuma loja encontrada",
          type: "warning",
        })
    return [];
  }
};

const getRestaurantesPorCategoriaNoLocation = async (
  pagina: number,
  categoria: number,
  setMaxPage: (max: number) => void
) => {
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/loja/segmento/categoria?page=${pagina}&size=10`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const restaur: Restaurant[] = [];
  if (response.data.content) {
    const rest = response.data.content;
    setMaxPage(response.data.totalPages);
    showMessage({
      message: "Erro",
      description: "Não pode procurar lojas sem um endereço!",
      type: "warning",
    });
  } else {
    showMessage({
      message: "Erro",
      description: "Não pode procurar lojas sem um endereço!",
      type: "warning",
    });
   
  }
};
const getRestaurantesPorId = async (id: number|undefined,lat:number,longi:number) => {
  if(id===undefined){
    showMessage({
      message: "Erro",
      description: "ID não encontrado",
      type: "danger",
    });
    return undefined;
  }
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/loja/${id}?lat=${lat}&longi=${longi}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.data) {
    return conversor(response.data);
  } else {
    Alert.alert("Aviso", "Nenhum restaurante encontrado");
    return undefined;
  }
}
const conversor = (rest: any) => {
  const restaurant: Restaurant = {
    id: rest.id,
    name: rest.nome,
    rating: rest.rating,
    category: rest.segmentoLoja.nome,
    deliveryTime: rest.deliveryTime
      ? timeConversor(rest.deliveryTime)
      : "30 min",
    image: rest.image,
    description: rest.descricao,
    address: `${rest.rua}, ${rest.numero}, ${rest.bairro}, ${rest.cidade}, ${rest.estado}`,
    time: rest.deliveryTime,
    tiposPagamento: rest.tiposPagamento
  };
  return restaurant;
};

const timeConversor = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${Math.floor(min)}min`;
  } else {
    return `${Math.floor(min)}min`;
  }
};

export {
  getRestaurantes,
  getRestaurantesNoLocation,
  getRestaurantesPorCategoria,
  getRestaurantesPorCategoriaNoLocation,
  conversor,
  getRestaurantesPorId,
};
