import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const handleRegister = async (nome: string, email: string, telefone: string, senha: string, confirma: string) => {
  if (!nome || !email || !telefone || !senha || !confirma) {
    Alert.alert("Erro", "Todos os campos são obrigatórios.");
    return;
  }
  if (senha !== confirma) {
    Alert.alert("Erro", "As senhas não coincidem.");
    return;
  }

  // Validando pra ver e enviou pelomenos duas Strings separadas, provavelmente não utilizaremos isto no futuro
  const [firstName, ...lastNameParts] = nome.trim().split(" ");
  const lastName = lastNameParts.join(" ");

  if (!firstName || !lastName) {
    Alert.alert("Erro", "Por favor, insira seu nome completo.");
    return;
  }


  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/create`, {
      firstName,
      lastName,
      email,
      password: senha,
      phoneNumber: telefone,
    });

    if (response.status === 201) {
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.push("/login");
    } else {
      Alert.alert("Erro", "Não foi possível completar o cadastro. Tente novamente.");
    }
  } catch (error: any) {
    console.error("Erro ao cadastrar:", error);
    Alert.alert("Erro", error.response?.data?.message || "Ocorreu um erro ao cadastrar.");
  }
};

export default handleRegister;