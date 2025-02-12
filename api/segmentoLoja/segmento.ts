import { Category } from "@/assets/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const getCategories = async ():Promise<Category[]> => {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/segmento/usados`;
    const response = await axios.get(url,{
        headers:{
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
        }
    });
    if (response.data) {
        return conversorLista(response.data);
    } else {
      showMessage({
        message: "Erro",
        description: "Nenhuma categoria encontrada",
        type: "warning",
      })
        return [];
    }
}



const conversor=(element:any):Category=>{
    const category:Category = {
        id: element.id,
        name: element.nome,
        emoji: element.emoji
    }
    return category
}
function conversorLista(elements: any[]): Category[] {
    const categories: Category[] = [];
    elements.forEach((element: any) => {
        categories.push(conversor(element));
    });
    return categories;
}

export { getCategories };
