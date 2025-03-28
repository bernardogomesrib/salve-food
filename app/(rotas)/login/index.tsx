import { doLogin } from '@/api/auth/authModule';
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { styles } from '../../../assets/styles/Styles';
import { useMyContext } from '@/components/context/appContext';
import { Linking } from 'react-native';
export default function TabOneScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { defineUsuario } = useMyContext();
  const login = async () => {
    console.log(`Email:${email} | Senha:${password}`);
    await doLogin(email, password);
    await defineUsuario();
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/salve-food.png")}
        style={styles.image}
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={{ width: "80%" }}
        keyboardType="email-address"
      />
      <Input label="Senha" secureTextEntry style={{ width: "80%" }} value={password} onChangeText={setPassword}/>
      <Text
        style={styles.esqueci}
        onPress={() => {
          const url = `${process.env.EXPO_PUBLIC_BACKEND_URL?.replace("8080", "9080/realms/salve/login-actions/reset-credentials?client_id=salve")}`;
          Linking.openURL(url);
        }}
      >
        Esqueci a senha
      </Text>
      <Button title="Entrar" style={styles.buttonEntrar} onPress={login} />
      <Text>
        Não tem uma conta?{" "}
        <Link href="/(rotas)/login/cadastro">
          <Text style={styles.esqueci}>Cadastre-se</Text>
        </Link>
      </Text>
    </View>
  );
}
