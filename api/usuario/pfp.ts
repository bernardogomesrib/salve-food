import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const mudarPfp = async (blob:Blob,mimetype:string) => {
  console.log("mudando pfp");
  console.log(mimetype);
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

     const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
       const reader = new FileReader();
       reader.onloadend = () => resolve(reader.result as ArrayBuffer);
       reader.onerror = reject;
       reader.readAsArrayBuffer(blob);
     });

     const byteArray = new Uint8Array(arrayBuffer);

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/usuario/pfp`,
      {
        file: Array.from(byteArray),
        mimetype,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response status:", response.status);

    if (response.status === 200) {
      showMessage({
        message: "Sucesso",
        description: "Imagem enviada com sucesso.",
        type: "success",
      });
      return response.data.pfp;
    } else {
      const errorData = response.data;
      showMessage({
        message: "Erro",
        description: `Não foi possível enviar imagem. ${errorData.message}`,
        type: "warning",
      });
    }
  } catch (error: any) {
    console.log(error.response);
    
    showMessage({
      message: "Erro",
      description: error.message,
      type: "danger",
    });
  }
};

export { mudarPfp };
