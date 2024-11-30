import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

import {
  StyleSheet,
  useColorScheme,
  View
} from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const color = useColorScheme();
  return (
    <View style={styles.container}>
      {/* Header */}
   

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <FontAwesome name="user-circle" size={100} color={color=='dark'? 'white':'black'} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Input
            label="Nome"
            style={styles.input}
            placeholder="Thyago Silva de Melo"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Número de Telefone"
            style={styles.input}
            placeholder="(81) 94002-8922"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>

          <Input
            label="Email"
            style={styles.input}
            placeholder="tsm6@discente.ifpe.edu.br"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Senha"
            style={styles.input}
            placeholder="************"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>
      </View>

      {/* Button */}
      <Button
        title="Editar Perfil"
        style={styles.editButton}
        onPress={() => console.log("Editar Perfil")}
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
