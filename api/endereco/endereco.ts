import { Address } from "@/assets/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

async function getCoordinatesFromAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    console.log("consultando endereco no google");
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyDohZlFgwg979AR1ndE_7eud9z7duRZ2GI`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      console.log(location);
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      console.error("Address not found or invalid request.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

const handleCepLookup = async (address: Address, func: Function) => {
  if (!address.cep) {
    showMessage({
      message: "Erro",
      description: "Digite um CEP válido.",
      type: "danger",
    })
    return;
  }
  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${address.cep}/json/`
    );
    const data = await response.json();
    if (data.erro) {
      showMessage({
        message: "Erro",
        description: "CEP não encontrado.",
        type: "danger",
      })
      return;
    }
    console.log(data);
    const coordinates = await getCoordinatesFromAddress(
      `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf} - ${data.cep}`
    );
    console.log(" foi retornado da função",coordinates);
    const latitude = coordinates?.latitude ?? null;
    const longitude = coordinates?.longitude ?? null;
    if (latitude && longitude) {
      func({
        ...address,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
        pais: "Brasil",
        cep: data.cep || "",
        latitude,
        longitude,
      });
    }else{
      showMessage({
        message: "Erro",
        description: "Não foi possível buscar informações do seu endereço.",
        type: "danger",
      })
    }
  } catch (error) {
    showMessage({
      message: "Erro",
      description: "Não foi possível buscar o CEP.",
      type: "danger",
    })
  }
};

const fetchAddress = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDohZlFgwg979AR1ndE_7eud9z7duRZ2GI`
    );
    const data = await response.json();
    if (!data.results.length) {
      showMessage({
        message: "Erro",
        description: "Endereço não encontrado.",
        type: "danger"
      })
      return;
    }

    const components = data.results[0].address_components;
    const addressString = data.results[0].formatted_address;

    return { addressString, components };
  } catch (error) {
    showMessage({
      message: "Erro",
      description: "Não foi possível buscar o endereço.",
      type: "danger"
    })
  }
};


const salvarEndereco = async (endereco: Address) => {
  console.log("tentando salvar")
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/endereco`,
      endereco,
      {
        headers: {
          'Authorization': 'Bearer ' + (await AsyncStorage.getItem('token'))
        }
      }
    );
    if (response.status === 200) {
      showMessage({
        message: "Sucesso",
        description: "Endereço salvo com sucesso.",
        type: "success"
      })
      return response.data
    } else {
      showMessage({
        message: "Erro",
        description: "Não foi possível salvar o endereço. Tente novamente.",
        type: "danger"
      })
    }
    
  } catch (error) {
    console.log(error);
  }
}
async function editarEndereco(enderecoParaEditar: Address) {
  console.log("tentando salvar");
  try {
    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/endereco`,
      enderecoParaEditar,
      {
        headers: {
          Authorization: "Bearer " + (await AsyncStorage.getItem("token")),
        },
      }
    );
    if (response.status === 200) {
      showMessage({
        message: "Sucesso",
        description: "Endereço salvo com sucesso.",
        type: "success",
      })
      return response.data;
    } else {
      showMessage({
        message: "Erro",
        description: "Não foi possível salvar o endereço. Tente novamente.",
        type: "danger",
      })

    }
  } catch (error:any) {
    console.log(error);
    showMessage({
      message: "Erro",
      description: error.response?.data?.message || "Ocorreu um erro ao salvar o endereço.",
      type: "danger",
    })
  }
}

export {
  editarEndereco, fetchAddress, getCoordinatesFromAddress,
  handleCepLookup, salvarEndereco
};
