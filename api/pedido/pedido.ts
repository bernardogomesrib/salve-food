import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { showMessage } from "react-native-flash-message"

const pegaPedidos = async (page: number, setTotalPages: Function) => {
  console.log("pegando pedidos")
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/pedidos/meus?page=${page}`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
      },
    });
    if (response.data.content.length > 0) {
      setTotalPages(response.data.totalPages);
      return response.data.content;
    } else if(response.data.totalPages!==undefined) {
      setTotalPages(response.data.totalPages);
      return response.data.content;
    }else{
      return undefined;
    }
  } catch (error:any) {
    
    showMessage({
      message: "Erro",
      description: error.message,
      type: "danger",
    });
    return undefined;
  }

    
};


const fazPedido= async (pedido: any) => {
    return await axios
        .post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/pedidos`, pedido, {
        headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        }
        }).then((respose)=>{
          if(respose.status >= 200 && respose.status < 300){
            showMessage({
              message: "Sucesso",
              description: "Pedido feito com sucesso.",
              type: "success",
            });
            return respose.data;
          }else{
            showMessage({
              message: "Erro",
              description: "Não foi possível fazer o pedido."+respose.data.error.message,
              type: "warning",
          });
        }
          return respose.data;
        }).catch((error) => {
          showMessage({
            message: "Erro",
            description: error.message,
            type: "danger",
          });
        });
}
export { pegaPedidos, fazPedido };