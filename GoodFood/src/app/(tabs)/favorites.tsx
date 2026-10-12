import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RecipeCard } from "../../components/RecipeCard";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { recipes } from "../../data/recipes";

export default function Favorites() {
    const favorites = React.useContext(FavoritesContext);
    if (!favorites) {
        throw new Error("FavoritesContext missing");
    }
    const { likedIds, setLikedIds } = favorites;
    const favoriteRecipes = recipes.filter((recipe) => likedIds.includes(recipe.id));

    return (
        <ScrollView>
        <View style={styles.grid}>
            {favoriteRecipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
            ))}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    grid: {
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
    },
});
