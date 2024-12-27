import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity } from "react-native";

import { StyleSheet, useColorScheme, View } from "react-native";

export default function Security() {
  const router = useRouter();
  const color = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    setModalVisible(true);
  };

  const confirmSave = () => {
    setModalVisible(false);
    Alert.alert("Sucesso", "Dados alterados com sucesso!");
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Shild Picture */}
      <View style={styles.ShildContainer}>
        <FontAwesome
          name="shield"
          size={100}
          color={color == "dark" ? "white" : "black"}
        />
      </View>

      {/* Form */}
      <View style={styles.form}>
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
            label="Senha Atual"
            style={styles.input}
            placeholder="Digite sua senha atual"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Nova senha"
            style={styles.input}
            placeholder="Digite sua nova senha"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Input
            label="Confirme a nova senha"
            style={styles.input}
            placeholder="Confirme a nova senha"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>
      </View>

      {/* Button */}
      <Button
        title="Alterar dados"
        style={styles.editButton}
        onPress={handleSave}
      />
      {/* Modal de Confirmação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Deseja confirmar a alteração dos dados?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmSave}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  ShildContainer: {
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#4CAF50",
  },
});
