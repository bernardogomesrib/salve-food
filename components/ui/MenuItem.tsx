import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useThemeColor } from "./themedefiner";

type MenuItemProps = {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress: () => void;
};

const MenuItem = ({ icon, label, onPress }: MenuItemProps) => {
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <FontAwesome name={icon} size={24} color={textColor} />
        <Text style={[styles.menuItemText, { color: textColor }]}>{label}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={textColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export { MenuItem };
