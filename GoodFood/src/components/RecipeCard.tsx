import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { Edamam } from "../api/apiService";
import { RecipeContext } from "../contexts/RecipeContext";
import { getCurrentUserId } from "../contexts/UserContext";
import { addFavouriteRecipe, removeFavouriteRecipe } from "../databaseAPI/API";

type Ingredient = {
  name: string;
  quantity?: number | string;
  unit?: string;
};

export type Recipe = {
  id: number;
  title: string;
  category?: string;
  servings?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
};


export function RecipeCard({ 
    recipe,
    showAddButton = false,
      onAdd,
}: {
    recipe: Recipe,
    showAddButton?: boolean,
    onAdd?: (recipeId: number) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nutrition, setNutrition] = useState<{
    calories: number; protein: number; carbs: number; fat: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);

  const favoriteContext = useContext(FavoritesContext);
  const recipeContext = useContext(RecipeContext);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const fetchWithRetry = async (query: string, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await Edamam.GetNutritionFromIngredients(query);
      } catch (e: any) {
        const is429 = String(e?.message ?? e).includes("429");
        if (!is429 || attempt === retries) throw e;
        await sleep(1500 * (attempt + 1)); // waits 2s, 4s, 6s
      }
    }
  };

  const fetchNutrition = async () => {
    if (!recipe.ingredients?.length || loading) return;
    setLoading(true);
    setError(false);
    setFailed([]);
    try {
      const ingredients = recipe.ingredients;
      const good: any[] = [];
      const failedNames: string[] = [];

      for (const i of ingredients) {
        const query = [i.quantity, i.unit, i.name]
          .filter((v) => v !== undefined && v !== null && v !== "")
          .join(" ");

        try {
          const value = await fetchWithRetry(query);
          await sleep(700);

          const d = value.data ?? value;
          console.log("OK", i.name, d.calories, d.totalWeight);
          if (!d.totalWeight) {
            failedNames.push(i.name);
            continue;
          }
          good.push(d);
        } catch (e: any) {
          console.log("REJECTED", i.name, e?.message ?? e);
          failedNames.push(i.name);
        }
      }

      setFailed(failedNames);

      if (good.length === 0) {
        setError(true);
        return;
      }

      const servings = recipe.servings && recipe.servings > 0 ? recipe.servings : 1;
      const sum = (pick: (d: any) => number | undefined) =>
        good.reduce((total, d) => total + (pick(d) ?? 0), 0);

      setNutrition({
        calories: sum((d) => d.calories),
        protein: sum((d) => d.totalNutrients?.PROCNT?.quantity),
        carbs: sum((d) => d.totalNutrients?.CHOCDF?.quantity),
        fat: sum((d) => d.totalNutrients?.FAT?.quantity),
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!favoriteContext || !recipeContext) return null;

  const { likedIds, setLikedIds } = favoriteContext;
  const { saveRecipe } = recipeContext;
  const isFavorite = likedIds.includes(recipe.id);

  const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const hasInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;

  const servings =
    recipe.servings && recipe.servings > 0
      ? recipe.servings
      : nutrition && recipe.calories && recipe.calories > 0
      ? Math.max(1, Math.round(nutrition.calories / recipe.calories))
      : undefined;

  const div = servings ?? 1;

  const calories = nutrition ? Math.round(nutrition.calories / div) : recipe.calories ?? 0;
  const protein = nutrition ? Math.round(nutrition.protein / div) : recipe.protein ?? 0;
  const carbs = nutrition ? Math.round(nutrition.carbs / div) : recipe.carbs ?? 0;
  const fat = nutrition ? Math.round(nutrition.fat / div) : recipe.fat ?? 0;

  async function toggleFavorite() {
      const userId = getCurrentUserId();
      if (userId === null) {
        return;
      }

      try {
      if (isFavorite) {
        const result = await removeFavouriteRecipe(userId, recipe.id);
        
        if (result === -1){
          throw new Error("Could not unfavorite");
        }

        setLikedIds((currentIds) => 
          currentIds.filter((recipeId) => recipeId !== recipe.id));
      } 

      else {
        const result = await addFavouriteRecipe(userId, recipe.id);
        
        if (result !== 1) {
          throw new Error("Could not favorite");
        }
        saveRecipe(recipe);
        setLikedIds((currentIds) => [...currentIds, recipe.id]);
      }
    } catch (error) {
    console.error("Favoritanropet misslyckades:", error);
  }}

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
                  <Text style={styles.macroValue}>{calories} kcal</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>{protein} g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Carbohydrates</Text>
                  <Text style={styles.macroValue}>{carbs} g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Fat</Text>
                  <Text style={styles.macroValue}>{fat} g</Text>
                </View>

                {servings !== undefined && (
                  <Text style={styles.servingsText}>
                    Nutrients in total, makes {servings} {servings === 1 ? "serving" : "servings"}
                  </Text>
                )}

                {error && <Text style={styles.errorText}>Couldn't load nutrition data.</Text>}
                {failed.length > 0 && (
                  <Text style={styles.errorText}>
                    Couldn't calculate: {failed.join(", ")}. These are left out of the totals.
                  </Text>
                )}
                {hasIngredients && !nutrition && (
                  <Pressable style={styles.fetchButton} onPress={fetchNutrition} disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.fetchButtonText}>Calculate exact nutrition</Text>
                    )}
                  </Pressable>
                )}
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
          onPress={toggleFavorite}
        >
          <Text style={[styles.likeButton, { color: isFavorite ? "red" : "gray" }]}>♡</Text>
        </TouchableOpacity>
        {showAddButton && (
          <TouchableOpacity
            style={styles.addButtonPosition}
            onPress={() => onAdd?.(recipe.id)}
            >
              <Text style={styles.likeButton}>+</Text>
          </TouchableOpacity>
        )}
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
  addButtonPosition: {
            position: "absolute",
            right: 50,
            bottom: 10,
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
  errorText: {
  color: "red",
  marginTop: 10,
  },
  fetchButton: {
    marginTop: 14,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#252824",
    alignItems: "center",
  },
  fetchButtonText: {
    color: "white",
    fontWeight: "600",
  },
    servingsText: {
    marginTop: 10,
    fontSize: 13,
    color: "#3a3f39",
  },
});