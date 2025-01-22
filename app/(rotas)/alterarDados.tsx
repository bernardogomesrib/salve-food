import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";

import { useMyContext } from "@/components/context/appContext";
import { useFocusEffect } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import { updateUser } from "../../api/auth/authModule";
export default function EditProfile() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const { usuario } = useMyContext();

  useFocusEffect(
    useCallback(() => {
      const fetchUsuario = async () => {
        if (usuario) {
          setEmail(usuario.email);
          setNome(usuario.name);
          setTelefone(usuario.phone);
        }
      }
      fetchUsuario();
    }, [])
  )

  const color = useColorScheme();
  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <FontAwesome
          name="user-circle"
          size={100}
          color={color == "dark" ? "white" : "black"}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Input
            value={nome}
            onChangeText={setNome}
            label="Nome"
            style={styles.input}
            placeholder="Fulano Beltrano da Silva"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            value={telefone}
            onChangeText={setTelefone}
            mask="(99) 99999-9999"
            label="Número de Telefone"
            style={styles.input}
            placeholder="(81) 94002-8922"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            value={email}
            onChangeText={setEmail}
            label="Email"
            style={styles.input}
            placeholder="tsm6@discente.ifpe.edu.br"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>

      </View>

      {/* Button */}
      <Button
        title="Editar Perfil"
        style={styles.editButton}
        onPress={() => updateUser(nome, email, telefone)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,

    marginBottom: 5,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  editButton: {
    padding: 16,
    borderRadius: 25,
    marginHorizontal: 25,
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
