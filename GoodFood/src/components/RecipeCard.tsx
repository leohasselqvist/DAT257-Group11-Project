import React, { useContext, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavoritesContext } from "../contexts/FavoritesContext";

type Ingredient = {
  name: string;
  quantity?: number | string;
  unit?: string;
};

type Recipe = {
  id: number;
  title: string;
  category?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [modalVisible, setModalVisible] = useState(false);
  const context = useContext(FavoritesContext);

  if (!context) return null;

  const { likedIds, setLikedIds } = context;
  const liked = likedIds.includes(recipe.id);

  const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const hasInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalView} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{recipe.title}</Text>

              {hasIngredients && (
                <>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {recipe.ingredients!.map((ingredient, index) => (
                    <Text key={`${ingredient.name}-${index}`} style={styles.recipeText}>
                      • {ingredient.name}
                      {ingredient.quantity !== undefined && ingredient.quantity !== null
                        ? ` — ${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ""}`
                        : ""}
                    </Text>
                  ))}
                </>
              )}

              {hasInstructions && (
                <>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  {recipe.instructions!.map((step, index) => (
                    <Text key={`${step}-${index}`} style={styles.recipeText}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                </>
              )}

                <Text style={styles.sectionTitle}>Nutrition</Text>

                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Calories</Text>
                  <Text style={styles.macroValue}>{recipe.calories ?? 0} kcal</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>{recipe.protein ?? 0} g</Text>
                </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.recipeCard, pressed && styles.recipeCardPressed]}
      >
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeCals}>{recipe.calories ?? 0} kcal</Text>
          <Text style={styles.recipeTime}>{recipe.time ?? "N/A"}</Text>
        </View>

        <TouchableOpacity
          style={styles.likeButtonPosition}
          onPress={() =>
            setLikedIds(liked ? likedIds.filter((i) => i !== recipe.id) : [...likedIds, recipe.id])
          }
        >
          <Text style={[styles.likeButton, { color: liked ? "red" : "gray" }]}>♡</Text>
        </TouchableOpacity>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
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
  recipeCardPressed: {
    opacity: 0.75,
  },
  recipeInfo: {
    padding: 13,
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
  likeButton: {
    fontSize: 28,
  },
  likeButtonPosition: {
    position: "absolute",
    right: 10,
    bottom: 8,
  },

  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: "85%",
    maxHeight: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#252824",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#252824",
    marginTop: 14,
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 15,
    color: "#3a3f39",
    lineHeight: 22,
    marginBottom: 6,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECEDE8",
  },
  macroLabel: {
    fontSize: 15,
    color: "#3a3f39",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#252824",
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#2196F3",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});