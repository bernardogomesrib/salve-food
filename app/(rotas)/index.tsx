
import { getTempo, getToken } from '@/components/funcoesParaApi/autenticacao';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function inicio(){
    const get = async () => {
        const token = await getToken();
        const tempo = await getTempo();
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