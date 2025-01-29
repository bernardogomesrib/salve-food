import { getExpirationTime, getToken } from '@/api/auth/authModule';
import { useMyContext } from '@/components/context/appContext';
import { View } from '@/components/Themed';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function inicio() {
    const [pushTo, setPushTo] = useState<'/(rotas)/home' | '/(rotas)/login' | null>(null);
    const {defineUsuario} = useMyContext();
    const get = async () => {
        try{const token = await getToken();
        const tempo = await getExpirationTime();
        if (token && tempo > Date.now()) {
            //router.push('/(rotas)/home');
            defineUsuario();
            setPushTo('/(rotas)/home');
        } else {
            //router.push('/(rotas)/login');
            setPushTo('/(rotas)/login');
        }}
        catch(e){
            console.log(e);
            setPushTo('/(rotas)/login');
        }
    }

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        get();
    }, []);
    useEffect(() => {
        if (pushTo) {
            const timeoutId = setTimeout(() => {
                router.push(pushTo);
            }, 1500);

            
            return () => { clearTimeout(timeoutId); setLoading(false); };
        }
    }, [pushTo]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }
}