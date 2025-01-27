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
    } else {
      setTotalPages(response.data.totalPages);
      return response.data.content;
    }
  } catch (error:any) {
    
    showMessage({
      message: "Erro",
      description: error.message,
      type: "danger",
    });
  }

    
};


const fazPedido= async (pedido: any) => {
    return await axios
        .post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/pedidos`, pedido, {
        headers: {
            Authorization: `Bearer ${AsyncStorage.getItem("token")}`,
        }
        }).then((respose)=>{
          if(respose.status >= 200 && respose.status < 300){
            showMessage({
              message: "Sucesso",
              description: "Pedido feito com sucesso.",
              type: "success",
            });

          }else{
            showMessage({
              message: "Erro",
              description: "Não foi possível fazer o pedido."+respose.data.error.message,
              type: "warning",
          });
            return respose.data;
        }).catch((error)=>{
          showMessage({
            message: "Erro",
            description: error.message,
            type: "danger",
          });
        });
}
export { pegaPedidos, fazPedido };