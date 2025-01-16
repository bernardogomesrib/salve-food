import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { styles as stilus } from '../../../assets/styles/Styles';
export default function RecuperarSenha() {
  const [nome,setNome]= useState("");
  const [email,setEmail] =useState("");
  const [telefone,setTelefone]=useState("");
  const [senha,setSenha]=useState("");
  const [confirma,setConfirma]=useState("");

  return (
    <View style={styles.container}>
        <Image source={require('../../../assets/images/salve-food.png')} style={stilus.image} />
        <Text style={{width:"70%", marginBottom:20}}>Para recuperação de senha, entre com a nova senha e a confirme</Text>
        <Input label={"Senha"} secureTextEntry style={{width:"80%"}}/>
        <Input label={"Confirmação de senha"} secureTextEntry style={{width:"80%"}}/>
        <Button title="Redefinir Senha" style={stilus.buttonEntrar} href="/(rotas)/alterarDados" />
        <Text style={{width:"70%", marginTop:20,textAlign:'center'}}>Já tem uma conta? <Link href="/(rotas)/login"><Text style={stilus.esqueci}>Entre</Text></Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
