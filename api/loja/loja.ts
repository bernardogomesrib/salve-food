import { Restaurant } from "@/components/context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";


const getRestaurantes = async (
  setRestaurantes: (restaurantes: Restaurant[]) => void
) => {
  console.log("getRestaurantes");
  const token = await AsyncStorage.getItem("token");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/loja`;

  console.log(url);
  const response = await axios.get(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => {
    console.log(res.data.content);
    if(res.data.content){
      const rest = res.data.content;
      rest.array.forEach((element:any) => {
        console.log(element);
      });
    }
  });
  
};


const conversor = (rest:any)=>{
  /* {
      "id": 1,
      "nome": "string",
      "rua": "string",
      "numero": "string",
      "bairro": "string",
      "cidade": "string",
      "estado": "string",
      "segmentoLoja": {
        "id": 1,
        "nome": "putaria"
      },
      "longitude": "string",
      "latitude": "string",
      "image": "http://10.31.89.124:9001/1loja/lojaImage?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=RoNHWxprGCgAVlnhOGbi%2F20250116%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250116T121932Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=74194926b9ede9a6384122e0ef1f8c89b7928a409fc533c6becbe422058f3478"
    }

    Restaurant {
      id: number;
      name: string;
      rating: number;
      category: string;
      deliveryTime: string;
      image: string;
      description: string;
      address: string;
    }
 */
  const restaurant: Restaurant = {
    id: rest.id,
    name: rest.nome,
    rating: 0, // Assuming rating is not available in the original object
    category: rest.segmentoLoja.nome,
    deliveryTime: "N/A", // Assuming deliveryTime is not available in the original object
    image: rest.image,
    description: "", // Assuming description is not available in the original object
    address: `${rest.rua}, ${rest.numero}, ${rest.bairro}, ${rest.cidade}, ${rest.estado}`
  };
  return restaurant;
}



export { getRestaurantes };