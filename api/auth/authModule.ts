import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

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
            router.push("/login");
            return;
        }

        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
            refreshToken,
        });

        const { access_token, refresh_token, expires_in, refresh_token_expires_in } = response.data;

        if (access_token && refresh_token) {
            await saveTokens({ access_token, refresh_token, expires_in, refresh_token_expires_in });

            if (!isUpdatingToken) {
                tokenUpdateRoutine();
            }
        } else {
            Alert.alert("Erro ao atualizar sessão", "Tokens inválidos recebidos do servidor.");
        }
    } catch (error: any) {
        Alert.alert("Erro ao atualizar sessão", error.message);
        router.push("/login");
    }
};

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
        console.error("Erro ao fazer login:", error.message);
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
        router.push("/login");
        return null;
    }
};

// Função que cria a rotina de atualização de token
const tokenUpdateRoutine = () => {
    if (!isUpdatingToken) {
        setIsUpdatingToken(true);
        setInterval(updateToken, 30000); // Chamar a cada 30 segundos
    } else {
        console.log("Uma rotina de atualização de token já está rodando.");
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
    router.push("/login");
};

export { doLogin, doLogout, getExpirationTime, getToken };
