import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Menu")}>
          <FontAwesome name="bars" size={24} color="#black" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/salve-food.png")}
          style={styles.logo}
        />
        <TouchableOpacity>
          <FontAwesome name="user" size={24} color="#black" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <FontAwesome name="user-circle" size={100} color="#black" />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Thyago Silva de Melo"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(81) 94002-8922"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="tsm6@discente.ifpe.edu.br"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="************"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => console.log("Editar Perfil")}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
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
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 25,
    marginHorizontal: 25,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
