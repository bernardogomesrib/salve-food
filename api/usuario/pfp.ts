import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const mudarPfp = async (formData:FormData) => {
  console.log("mudando pfp");

  try {
    /* ${process.env.EXPO_PUBLIC_BACKEND_URL}/ */
    const response = await fetch(`http://192.168.0.25:8080/api/usuario/pfp`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      showMessage({
        message: "Sucesso",
        description: "Imagem enviada com sucesso.",
        type: "success",
      });
    } else {
      const errorData = await response.json();
      showMessage({
        message: "Erro",
        description: `Não foi possível enviar imagem. ${errorData.message}`,
        type: "warning",
      });
    }
  } catch (error: any) {
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
