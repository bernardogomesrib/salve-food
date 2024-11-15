import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";

const mockMenuItems = {
  1: [
    {
      id: 1,
      name: "Feijoada Completa",
      description: "Feijoada tradicional com arroz, couve e farofa",
      price: 45.9,
      image: "https://via.placeholder.com/400",
      category: "Pratos Principais",
    },
    {
      id: 2,
      name: "Moqueca de Peixe",
      description: "Peixe fresco com leite de coco e dendê",
      price: 52.9,
      image: "https://via.placeholder.com/400",
      category: "Pratos Principais",
    },
  ],
  2: [
    {
      id: 1,
      name: "Pizza Margherita",
      description: "Molho de tomate, mussarela, manjericão",
      price: 39.9,
      image: "https://via.placeholder.com/400",
      category: "Pizzas",
    },
    {
      id: 2,
      name: "Lasanha à Bolonhesa",
      description: "Massa fresca, molho bolonhesa e bechamel",
      price: 45.9,
      image: "https://via.placeholder.com/400",
      category: "Massas",
    },
  ],
};

const mockRestaurants = {
  1: {
    id: 1,
    name: "Restaurante do Chef",
    rating: 4.8,
    category: "Brasileira",
    deliveryTime: "30-45 min",
    image: "https://via.placeholder.com/400",
    description:
      "O melhor da culinária brasileira com ingredientes frescos e selecionados.",
    address: "Rua das Flores, 123 - Centro",
  },
  2: {
    id: 2,
    name: "Pizza Express",
    rating: 4.5,
    category: "Italiana",
    deliveryTime: "40-55 min",
    image: "https://via.placeholder.com/400",
    description:
      "Pizzas artesanais com massa feita na hora e ingredientes importados.",
    address: "Av. Principal, 456 - Jardim Europa",
  },
};

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const restaurant = mockRestaurants[id as keyof typeof mockRestaurants];
  const menuItems = mockMenuItems[id as keyof typeof mockMenuItems];
  const categories = ["Todos", ...new Set(menuItems.map((item) => item.category))];

  const filteredItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant?.name || "Restaurante",
          headerTitleStyle: {
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <Image
          source={restaurant.image}
          style={styles.coverImage}
          contentFit="cover"
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.description}>{restaurant.description}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text style={styles.infoText}>{restaurant.rating}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="clock" size={16} color="#666" />
                <Text style={styles.infoText}>{restaurant.deliveryTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={16} color="#666" />
                <Text style={styles.infoText}>{restaurant.category}</Text>
              </View>
            </View>

            <Text style={styles.address}>{restaurant.address}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.menuContainer}>
            {filteredItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.menuItemPrice}>
                    R$ {item.price.toFixed(2)}
                  </Text>
                </View>
                <Image
                  source={item.image}
                  style={styles.menuItemImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  restaurantInfo: {
    backgroundColor: "white",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: 'transparent',
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: "#000",
  },
  categoryButtonText: {
    color: "#666",
  },
  categoryButtonTextActive: {
    color: "white",
  },
  menuContainer: {
    padding: 20,
    paddingTop: 0,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemInfo: {
    flex: 1,
    padding: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: '#000',
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#2E7D32',
  },
  menuItemImage: {
    width: 100,
    height: 100,
  },
});