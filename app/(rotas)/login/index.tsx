import { doLogin } from '@/api/auth/authModule';
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { styles } from '../../../assets/styles/Styles';
export default function TabOneScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = async () => {
    console.log(email, password);
    const retult = await doLogin(email, password);
    console.log(retult);


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
      <Link href="/(rotas)/login/enviarEmail" style={styles.esqueci}>
        <Text style={styles.esqueci}>Esqueci a senha</Text>
      </Link>
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
