import { useMyContext } from "@/components/context/appContext";
import { Text, useThemeColor, View } from "@/components/Themed";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function RestaurantScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { restaurant, products, handleProductSelection } = useMyContext();
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );

  const menuItems = products;
  const categories = [
    "Todos",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant?.name || "carregando",
          headerTitleStyle: {
            fontSize: 18,
            color: textColor,
          },
          headerShadowVisible: true,
        }}
      />
      <View style={[styles.container, { backgroundColor }]}>
        <Image
          source={restaurant?.image}
          style={styles.coverImage}
          contentFit="cover"
        />

        <ScrollView
          style={[styles.content, { backgroundColor }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.restaurantInfo, { backgroundColor }]}>
            <Text style={[styles.restaurantName, { color: textColor }]}>
              {restaurant?.name}
            </Text>
            <Text style={[styles.description, { color: textColor }]}>
              {restaurant?.description}
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text style={[styles.infoText, { color: textColor }]}>
                  {restaurant?.rating}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="clock" size={16} color="#666" />
                <Text style={[styles.infoText, { color: textColor }]}>
                  {restaurant?.deliveryTime}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={16} color="#666" />
                <Text style={[styles.infoText, { color: textColor }]}>
                  {restaurant?.category}
                </Text>
              </View>
            </View>

            <Text style={[styles.address, { color: textColor }]}>
              {restaurant?.address}
            </Text>
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
                  { backgroundColor: selectedCategory === category ? textColor : backgroundColor },
                ]}
                onPress={() => {if(category =="Todos")console.log(restaurant);
                  setSelectedCategory(category)}}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category &&
                      styles.categoryButtonTextActive,
                    { color: selectedCategory === category ? backgroundColor : textColor },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.menuContainer}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { backgroundColor }]}
                onPress={() => handleProductSelection(item)}
              >
                <View style={styles.menuItemInfo}>
                  <Text style={[styles.menuItemName, { color: textColor }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.menuItemDescription, { color: textColor }]}
                  >
                    {item.description}
                  </Text>
                  <Text style={[styles.menuItemPrice, { color: textColor }]}>
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
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  infoText: {
    fontSize: 14,
  },
  address: {
    fontSize: 14,
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
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
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fff",
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
  },
  menuItemDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  menuItemImage: {
    width: 100,
  },
});