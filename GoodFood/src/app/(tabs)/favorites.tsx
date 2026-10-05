import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
        <View style={styles.container}>
            {favoriteRecipes.map(recipe => (
                <View key={recipe.id}>
                    <Text>{recipe.title}</Text>
                    <Text>{recipe.category}</Text>
                    <Text>{recipe.time}</Text>
                    
                    <TouchableOpacity onPress={() => setLikedIds(likedIds.filter((id) => id !== recipe.id))}>
                        <Text style={{ fontSize: 28, color: "red" }}>♡</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
