import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { recipes } from "../data/recipes";

type Recipe = (typeof recipes)[number];

export function RecipeCard({ recipe }: { recipe: Recipe }) {
    const context = useContext(FavoritesContext);
    if (!context) return null;
    const { likedIds, setLikedIds } = context;
    const liked = likedIds.includes(recipe.id);

    return (
        <Pressable
            onPress={() => alert(`${recipe.title} full macronutrient breakdown: \nCalories: ${recipe.calories} kcal \nProtein: ${recipe.protein}g \nCarbohydrates: ${recipe.carbs}g \nFat: ${recipe.fat}g`)}
            style={({ pressed }) => [styles.recipeCard, pressed && styles.recipeCardPressed]}
        >
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeCals}>{recipe.calories} kcal</Text>
                <Text style={styles.recipeTime}>{recipe.time}</Text>
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
        }
    });