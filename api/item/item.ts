import AsyncStorage from "@react-native-async-storage/async-storage";

const getItems = async (lojaId:number, pagina: number) => {
  const token = await AsyncStorage.getItem("token");/* 
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/item?page=${pagina}&size=10&lat=${pos.latitude}&longi=${pos.longitude}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const restaur: Restaurant[] = [];
  if (response.data.content) {
    const rest = response.data.content;
    rest.forEach((element: any) => {
      restaur.push(conversor(element));
    });
    return restaur;
  } else {
    Alert.alert("Aviso", "Nenhum restaurante encontrado");
    return [];
  } */
};
