import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from 'expo-router';
import { Alert } from "react-native";

let isUpdatingToken = false;
const setIsUpdatingToken = (value: boolean) => {
    isUpdatingToken = value;
}

//função que é para ser chamada a cada 250s para atualizar o token
    const atualizarToken = async () => {
        const token = await AsyncStorage.getItem('refresh_token')
            .then((token) => {
                if (!token) {
                    router.push('/login');
                } else {
                    axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/refresh`, { refreshToken: token })
                        .then((response) => {
                            console.log(response);
                            if(response.data.access_token){
                                AsyncStorage.setItem('token', response.data.access_token);
                                AsyncStorage.setItem('refresh_token', response.data.refresh_token);
                                const tokenExpiresIn = new Date().getTime() + response.data.expires_in * 1000;
                                const refreshTokenExpiresIn = new Date().getTime() + response.data.refresh_token_expires_in * 1000;
                                AsyncStorage.setItem('tokenExpires', tokenExpiresIn.toString());
                                AsyncStorage.setItem('refresh_token_expires_in', refreshTokenExpiresIn.toString());
                                if(!isUpdatingToken){
                                    rotinaAtualizarToken();
                                }
                            }else{
                                console.log(response.data);
                                Alert.alert("Erro ao atualizar sessão:", response.data);
                            }
                        }).catch((error) => {
                            Alert.alert("Erro ao atualizar sessão:", error);
                            router.push('/login');
                        })
                }
            });

    };

    //função que é chamada para fazer login

    const fazerLogin = async (login: string, password: string) => {
        console.log('fazendo login');
        axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`, { username:login, password:password })
            .then((response) => {
                if(response.data.acces_token){
                    console.log('login feito com sucesso');
                }
                AsyncStorage.setItem('token', response.data.access_token);
                AsyncStorage.setItem('refresh_token', response.data.refresh_token);
                const tokenExpiresIn = new Date().getTime() + response.data.expires_in * 1000;
                const refreshTokenExpiresIn = new Date().getTime() + response.data.refresh_token_expires_in * 1000;
                AsyncStorage.setItem('tokenExpires', tokenExpiresIn.toString());
                AsyncStorage.setItem('refresh_token_expires_in', refreshTokenExpiresIn.toString());
                AsyncStorage.setItem('login', login);
                AsyncStorage.setItem('password', password);
                rotinaAtualizarToken();
                router.push('/(rotas)/home');
            }).catch((error) => {
                return error;
            });
    }
    //função para pegar o tempo de expiração do token

    const getTempo = async () => {
        const tempo = await AsyncStorage.getItem('tokenExpires');
        return Number(tempo);
    }
    //função que é chamada para pegar o token
    const getToken = async (): Promise<string | null> => {
        const login = await AsyncStorage.getItem('login');
        const password = await AsyncStorage.getItem('password');
        const token = await AsyncStorage.getItem('token');
        const tempo = await AsyncStorage.getItem('tokenExpires');
        const tempoRefresh = await AsyncStorage.getItem('refresh_token_expires_in');
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (token && Number(tempo) > Date.now()) {
            rotinaAtualizarToken();
            return token;
        } else if (refreshToken && Number(tempoRefresh) > Date.now()) {
            await atualizarToken();
            const tk = await AsyncStorage.getItem('token');
            return tk;
        } else {
            if (login && password) {
                await fazerLogin(login, password);
                const tk = await AsyncStorage.getItem('token');
                return tk;
            } else {
                router.push('/login');
                return null;
            }
        }
    }


    //função que cria a rotina de chamar o atualizarToken a cada 30s
    const rotinaAtualizarToken = () => {
        if (!isUpdatingToken) {
            setIsUpdatingToken(true);
            setInterval(atualizarToken, 30000);
        }else{
            console.log("uma rotina de atualização de token está já está rodando");
        }
        
    }


    //função para fazer logout

    const fazerLogout = async () => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('refresh_token');
        AsyncStorage.removeItem('tokenExpires');
        AsyncStorage.removeItem('refresh_token_expires_in');
        router.push('/login');
    }

export {
    fazerLogin,
    fazerLogout, getTempo, getToken
};

