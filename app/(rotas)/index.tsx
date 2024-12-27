
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function inicio(){
    const getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if(token){
            router.push('/(rotas)/home');
        }else{
            router.push('/(rotas)/login');
        }
    }
    useEffect(() => {
        getToken();
    },[]);
}