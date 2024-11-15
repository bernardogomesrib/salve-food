import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { styles } from './Styles';
export default function TabOneScreen() {
  const [email, setEmail] = useState('');
  
  function login(){
    router.replace('/(rotas)/home')
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/salve-food.png')} style={styles.image} />
      <Input label="Email" value={email} onChangeText={setEmail} style={{width:"80%"}} keyboardType='email-address'/>
      <Input label="Senha" secureTextEntry style={{width:"80%"}}/>
      <Link href="/recuperarSenha" asChild><Text style={styles.esqueci}>Esqueci a senha</Text></Link>
      <Button title="Entrar" style={styles.buttonEntrar} onPress={login}/>
      <Text>Não tem uma conta? <Link href="/cadastro"><Text style={styles.esqueci}>Cadastre-se</Text></Link></Text>
    </View>
  );
}


