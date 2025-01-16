import { getExpirationTime, getToken } from '@/api/auth/authModule';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function inicio(){
    const get = async () => {
        const token = await getToken();
        const tempo = await getExpirationTime();
        if(token && tempo > Date.now()){
            router.push('/(rotas)/home');
        }else{
            router.push('/(rotas)/login');
        }
    }
    useEffect(() => {
        get();
    },[]);
}