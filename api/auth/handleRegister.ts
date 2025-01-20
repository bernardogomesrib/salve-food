import axios from 'axios';
import { router } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

const handleRegister = async (nome: string, email: string, telefone: string, senha: string, confirma: string) => {
  if (!nome || !email || !telefone || !senha || !confirma) {
    showMessage({
      message: "Erro",
      description: "Todos os campos são obrigatórios.",
      type: "danger",
    })
    return;
  }
  if (senha !== confirma) {
    showMessage({
      message: "Erro",
      description: "As senhas não coincidem.",
      type: "danger",
    })
    return;
  }

  // Validando pra ver e enviou pelomenos duas Strings separadas, provavelmente não utilizaremos isto no futuro
  const [firstName, ...lastNameParts] = nome.trim().split(" ");
  const lastName = lastNameParts.join(" ");

  if (!firstName || !lastName) {
    showMessage({
      message: "Erro",
      description: "Por favor, insira seu nome completo.",
      type: "danger",
    })
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
      showMessage({
        message: "Sucesso",
        description: "Cadastro realizado com sucesso!",
        type: "success",
      })
      router.push("/login");
    } else {
      showMessage({
        message: "Erro",
        description: "Não foi possível completar o cadastro. Tente novamente.",
        type: "danger",
      })
    }
  } catch (error: any) {
    showMessage({
      message: "Erro",
      description: error.response?.data?.message || "Ocorreu um erro ao cadastrar.",
      type: "danger",
    })
  }
};

export default handleRegister;