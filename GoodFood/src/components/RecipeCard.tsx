
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Recipe } from "../api/types";
import LikeButton from "./LikeButton";
import RecipeModal from "./RecipeModal";

type RecipeCardProps = {
  recipe: Recipe;
  userId: number | null;
};

export function RecipeCard({ recipe, userId }: RecipeCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.recipeCard}>
        <Pressable
          style={({ pressed }) => [
            styles.recipeInfo,
            pressed && styles.recipeCardPressed,
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {recipe.name}
          </Text>

          <Text style={styles.recipeCals}>
            {recipe.calories_per_serving} kcal
          </Text>

          <Text style={styles.recipeTime}>
            {recipe.prep_time + recipe.cook_time} min
          </Text>
        </Pressable>

        <LikeButton recipeId={recipe.id} userId={userId} />
      </View>

      <RecipeModal
        recipe={recipe}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    position: "relative",
    width: 210,
    height: 100,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  recipeInfo: {
    flex: 1,
    padding: 13,
    paddingRight: 55,
  },
  recipeCardPressed: {
    opacity: 0.75,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#252824",
    lineHeight: 21,
  },
  recipeTime: {
    fontSize: 13,
    color: "#3a3f39",
  },
  recipeCals: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3a3f39",
  },
});
