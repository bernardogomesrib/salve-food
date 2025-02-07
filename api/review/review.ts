import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { showMessage } from "react-native-flash-message"
import { Review } from "@/assets/types/types";

const verificarReviewExistente = async (idLoja: number) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/review/verificar/${idLoja}`,
      {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return false;
  }
};

const criarReview = async (review: Review) => {
  try {
    const formData = new FormData();

    formData.append('idLoja', review.idLoja.toString());
    formData.append('nota', review.nota.toString());

    if (review.comentario) {
      formData.append('comentario', review.comentario);
    }

    if (review.imagem) {
      const imageBlob = {
        uri: review.imagem.uri,
        type: 'image/jpeg',
        name: 'image.jpg'
      } as any;
      formData.append('imagem', imageBlob);
    }

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/review`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      showMessage({
        message: "Sucesso",
        description: "Avaliação enviada com sucesso.",
        type: "success",
      });
      return true;
    }
    return false;

  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message;

    if (errorMessage?.includes('Você já fez uma review')) {
      return true;
    }

    throw error;
  }
}

export { criarReview, verificarReviewExistente };