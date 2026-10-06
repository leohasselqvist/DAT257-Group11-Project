import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { RecipeCard } from "../../components/RecipeCard";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { recipes } from "../../data/recipes";

export default function Favorites() {
    const [cartIds, setCartIds] = React.useState<number[]>([]); /* state för varukorgen */

    function addToCart(recipeId: number) {
        setCartIds((currentIds) => [...currentIds, recipeId])
    }

    function removeFromCart(indexToRemove: number) {
        setCartIds((currentIds) => currentIds.filter((id, index) => index !== indexToRemove)
    );
    }

    const favorites = React.useContext(FavoritesContext);
    if (!favorites) {
        throw new Error("FavoritesContext missing");
    }

    const { likedIds, setLikedIds } = favorites;

    const favoriteRecipes = recipes.filter((recipe) => likedIds.includes(recipe.id));

    return (
        <ScrollView>
            <View style={styles.layout}>
                <View style={styles.grid}>
                    {favoriteRecipes.map((r) => (
                    <RecipeCard key={r.id} recipe={r} showAddButton={true} onAdd={addToCart} />
                ))}
                </View>
                <View style={styles.cart}>
                    <Text>Cart</Text>
                    <Text>Selected Recipes: {cartIds.length}</Text>
                    {cartIds.map((id, index) => {
                        const recipe = recipes.find((r) => r.id === id);
                        if (!recipe) return null;
                        
                    return <RecipeCard key={index} recipe={recipe} showAddButton={true} onAdd={() => removeFromCart(index)} />;
                    })}
                </View>
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
        flex: 1,
    },
    layout: {
        flexDirection: "row",
        alignItems: "flex-start"
    },
    cart: {
        width: 240,
        padding: 12,
        margin: 10,
        backgroundColor: "#ECEDE8",
        borderRadius: 12,
        gap: 10,
    }
});
