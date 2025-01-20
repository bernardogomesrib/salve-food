import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { styles as stilus } from "../../../assets/styles/Styles";
import handleRegister from "@/api/auth/handleRegister";

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/salve-food.png")}
        style={stilus.image}
      />
      <Text style={{ width: "70%", marginBottom: 20 }}>
        Para se cadastrar na nossa plataforma preencha os campos abaixo.
      </Text>
      <Input
        label={"Nome completo"}
        value={nome}
        onChangeText={setNome}
        style={{ width: "80%" }}
      />
      <Input
        label={"Email"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ width: "80%" }}
      />
      <Input
        mask="(99) 99999-9999"
        label={"Telefone"}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        style={{ width: "80%" }}
      />
      <Input
        label={"Senha"}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ width: "80%" }}
      />
      <Input
        label={"Confirmação de senha"}
        value={confirma}
        onChangeText={setConfirma}
        secureTextEntry
        style={{ width: "80%" }}
      />
      <Button
        title="Cadastrar"
        onPress={() => handleRegister(nome, email, telefone, senha, confirma)}
        style={stilus.buttonEntrar}
      />
      <Text style={{ width: "70%", marginTop: 20, textAlign: "center" }}>
        Já tem uma conta?{" "}
        <Link href="/(rotas)/login">
          <Text style={stilus.esqueci}>Entre</Text>
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
