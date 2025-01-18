import { MenuItem } from "@/assets/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const getItemsDaApi = async (lojaId:number) => {
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/item`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const restaur: MenuItem[] = [];
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


const conversor = (element: any): MenuItem => {

  return {
    id: element.id,
    name: element.nome,
    description: element.descricao,
    price: element.valor,
    image: element.itemImage,
    category: element.categoriaItem.nome,
  };
};
export { getItemsDaApi };