import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const mudarPfp = async (formData: FormData) => {
  console.log("mudando pfp");
  console.log("Form data:", formData);
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

  

    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/usuario/pfp`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
    } else {
      const errorData = response.data;
      showMessage({
        message: "Erro",
        description: `Não foi possível enviar imagem. ${errorData.message}`,
        type: "warning",
      });
    }
  } catch (error: any) {
    console.log("Erro ao enviar imagem:", error);
    console.log(
      "Erro detalhado:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    showMessage({
      message: "Erro",
      description: error.message,
      type: "danger",
    });
  }
};

export { mudarPfp };
