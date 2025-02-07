import { useState, useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { criarReview, verificarReviewExistente } from "@/api/review/review";
import { Review } from "@/assets/types/types";
import { Text, View } from "./Themed";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Input } from "./ui/input";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ReviewSection({
  idLoja,
  textColor,
  backgroundColor,
}: {
  idLoja: number;
  textColor: string;
  backgroundColor: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const checkReview = async () => {
      try {
        const hasReview = await verificarReviewExistente(idLoja);
        setSuccess(hasReview);
      } catch (err) {
        console.error("Erro ao verificar review:", err);
      } finally {
        setLoading(false);
      }
    };

    checkReview();
  }, [idLoja]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      showMessage({
        message: "Erro",
        description: "Erro ao selecionar imagem",
        type: "danger",
      });
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      showMessage({
        message: "Erro",
        description: "Por favor, selecione uma nota",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reviewData: Review = {
        idLoja,
        nota: rating,
        comentario: comment.trim() || undefined,
      };

      if (image) {
        reviewData.imagem = {
          uri: image,
          type: "image/jpeg",
          name: "image.jpg",
        };
      }

      const result = await criarReview(reviewData);
      if (result === true) {
        setSuccess(true);
      }
      setComment("");
      setRating(0);
      setImage(null);
    } catch (err: any) {
      // Erro já tratado na função criarReview
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Carregando...
        </Text>
      </View>
    );
  }

  if (success) {
    return (
      <View style={[styles.card, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          <FontAwesome name="star" size={18} color={textColor} /> Avaliação
          enviada
        </Text>
        <Text style={[styles.successText, { color: textColor }]}>
          Obrigado por avaliar o restaurante!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        <FontAwesome name="star" size={18} color={textColor} /> Avaliar
        Restaurante
      </Text>

      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <FontAwesome
              name={rating >= star ? "star" : "star-o"}
              size={30}
              color={rating >= star ? "#FFD700" : "#808080"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Comentário"
        style={[styles.commentInput, { color: textColor, borderColor: textColor }]}
        placeholder="Deixe seu comentário"
        placeholderTextColor="#808080"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <FontAwesome5 name="camera" size={20} color="#666" />
        <Text style={styles.imageButtonText}>
          {image ? "Alterar Imagem" : "Adicionar Imagem"}
        </Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setImage(null)}
          >
            <FontAwesome name="times-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={handleSubmitReview}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Enviando..." : "Enviar Avaliação"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successText: {
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "#FF0000",
    marginBottom: 16,
    textAlign: "center",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    borderStyle: "dashed",
    gap: 8,
  },
  imageButtonText: {
    color: "#666",
    fontSize: 16,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 16,
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
});