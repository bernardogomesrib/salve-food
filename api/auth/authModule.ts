import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Usuario } from '@/api/auth/tokenHandler';
let isUpdatingToken = false;

const setIsUpdatingToken = (value: boolean) => {
  isUpdatingToken = value;
};

// Função para salvar varias coisas de uma só vez no async storage (poupa bastante trabalho)
const saveTokens = async (data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
}) => {
  const tokenExpiresIn = Date.now() + data.expires_in * 1000;
  const refreshTokenExpiresIn = Date.now() + data.refresh_token_expires_in * 1000;

  await AsyncStorage.multiSet([
    ["token", data.access_token],
    ["refresh_token", data.refresh_token],
    ["tokenExpires", tokenExpiresIn.toString()],
    ["refresh_token_expires_in", refreshTokenExpiresIn.toString()],
  ]);
};

// Função para atualizar o token
const updateToken = async (): Promise<void> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    if (!refreshToken) {
      stopTokenUpdateRoutine();
      router.push("/(rotas)/login");
      return;
    }
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/refresh`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    const responseData = await response.json();

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = responseData;

    if (access_token && refresh_token) {
      await saveTokens({
        access_token,
        refresh_token,
        expires_in,
        refresh_token_expires_in,
      });

      if (!isUpdatingToken) {
        tokenUpdateRoutine();
      }
    } else {
      stopTokenUpdateRoutine();
      showMessage({
        message: "Erro ao atualizar sessão",
        description: "Tokens inválidos recebidos do servidor.",
        type: "danger",
      })
    }
  } catch (error: any) {
    stopTokenUpdateRoutine()
    showMessage({
      message: "Erro ao atualizar sessão",
      description: error.message,
      type: "danger",
    })
    /* router.push("/login"); */
  }
};

const updateUser = async (
  nome: string,
  email: string,
  telefone: string
) => {
  if (!nome || !email || !telefone) {
    showMessage({
      message: "Erro",
      description: "Todos os campos são obrigatórios.",
      type: "danger",
    });
    return;
  }
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
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return;
    }

    const response = await axios.put(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth`, {
      firstName,
      lastName,
      email,
      phone: telefone,

    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      showMessage({
        description: "Dados atualizados com sucesso!",
        message: "Sucesso",
        type: "success",
      });
      router.back();
    } else {
      showMessage({
        message: "Erro",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        type: "danger",
      });
    }
  } catch (error: any) {
    console.log(JSON.stringify(error))
    showMessage({
      message: "Erro",
      description: error.response?.data?.message || "Ocorreu um erro ao atualizar os dados.",
      type: "danger",
    });
  }
}
// Função para fazer login
const doLogin = async (login: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`, {
      username: login,
      password,
    });

    const { access_token, refresh_token, expires_in, refresh_token_expires_in } = response.data;

    if (access_token && refresh_token) {
      await saveTokens({ access_token, refresh_token, expires_in, refresh_token_expires_in });
      await AsyncStorage.multiSet([
        ["login", login],
        ["password", password],
      ]);

      tokenUpdateRoutine();
      router.push("/(rotas)/home");
    } else {
      throw new Error("Resposta inválida do servidor.");
    }
  } catch (error: any) {
    showMessage({
      message: "Erro ao fazer login",
      description: error.message,
      type: "danger",
    })
    throw new Error("Falha no login. Verifique suas credenciais.");
  }
};

// Função para obter o tempo de expiração do token
const getExpirationTime = async (): Promise<number> => {
  const tempo = await AsyncStorage.getItem("tokenExpires");
  return Number(tempo);
};

// Função para obter o token
const getToken = async (): Promise<string | null> => {
  const [login, password, token, tempo, tempoRefresh, refreshToken] = await Promise.all([
    AsyncStorage.getItem("login"),
    AsyncStorage.getItem("password"),
    AsyncStorage.getItem("token"),
    AsyncStorage.getItem("tokenExpires"),
    AsyncStorage.getItem("refresh_token_expires_in"),
    AsyncStorage.getItem("refresh_token"),
  ]);

  const now = Date.now();

  if (token && Number(tempo) > now) {
    tokenUpdateRoutine();
    return token;
  } else if (refreshToken && Number(tempoRefresh) > now) {
    await updateToken();
    return AsyncStorage.getItem("token");
  } else if (login && password) {
    await doLogin(login, password);
    return AsyncStorage.getItem("token");
  } else {
    router.push("/(rotas)/login");
    return null;
  }
};

// Função que cria a rotina de atualização de token
let tokenUpdateInterval: NodeJS.Timeout | null = null;

const tokenUpdateRoutine = () => {
  if (tokenUpdateInterval === null) {
    setIsUpdatingToken(true);
    tokenUpdateInterval = setInterval(updateToken, 30000); // Chamar a cada 3 segundos
  } else {
    console.log("Uma rotina de atualização de token já está rodando.");
  }
};

// Função para parar a rotina de atualização de token
const stopTokenUpdateRoutine = () => {
  if (tokenUpdateInterval) {
    clearInterval(tokenUpdateInterval);
    tokenUpdateInterval = null;
    setIsUpdatingToken(false);
  }
};

// Função para fazer logout
const doLogout = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    "token",
    "refresh_token",
    "tokenExpires",
    "refresh_token_expires_in",
    "login",
    "password",
  ]);
  stopTokenUpdateRoutine();
  router.push("/login");
};

export { doLogin, doLogout, getExpirationTime, getToken, updateUser };
