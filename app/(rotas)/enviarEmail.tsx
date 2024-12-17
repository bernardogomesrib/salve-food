import { Text, View } from "@/components/Themed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, } from "react-native";
import { styles as stilus } from "../../assets/styles/Styles";

export default function EnviarEmail() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("E-mail enviado para: ", email);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/salve-food.png")}
        style={stilus.image}
      />
      <Text style={styles.instructionText}>
        Digite o e-mail da sua conta para receber o código de redefinição da senha.
      </Text>
      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button
        title="Enviar"
        onPress={handleSubmit}
        style={stilus.buttonEntrar}
        href="/recuperarSenha"
      />
      <Text style={styles.footerText}>
        Já tem uma conta?{" "}
        <Link href="/(rotas)">
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
    paddingHorizontal: 20,
    
  },
  instructionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    width: "80%",
  },
  input: {
    width: "80%",
    marginBottom: 20,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
