import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Recipe, RecipeCard } from "../../components/RecipeCard";
import { colors } from "../../constants/colors";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { RecipeContext } from "../../contexts/RecipeContext";
type ShoppingListItem = {
    ingredientId: number;
    name: string;
    quantity: number;
    unit: string;
}
function createShoppingList(cartIds: number[], savedRecipes: Recipe[]): ShoppingListItem[] {
    const shoppingList: ShoppingListItem[] = [];

    for (const recipeId of cartIds) {
        const recipe = savedRecipes.find((recipe) => recipe.id === recipeId);

        if(!recipe || !recipe.ingredients) {
            continue;
        }

        for (const ingredient of recipe.ingredients) {
            if (typeof ingredient.quantity !== "number") { continue; }

            const unit = ingredient.unit ?? "";

            const existingItem  = shoppingList.find((item) => item.ingredientId === ingredient.id && item.unit === unit);

            if (existingItem) {
            existingItem.quantity += ingredient.quantity;
            } 

            else {
                shoppingList.push({
                    ingredientId: ingredient.id,
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: unit,
            });
        }
    }

    }
    return shoppingList;
}
export default function Favorites() {
    const [cartIds, setCartIds] = React.useState<number[]>([]); /* state för varukorgen */
    const [shoppingList, setShoppingList] = React.useState<ShoppingListItem[]>([]);
    function addToCart(recipeId: number) {
        setCartIds((currentIds) => [...currentIds, recipeId])
        setShoppingList([]);
    }

    function removeFromCart(indexToRemove: number) {
        setCartIds((currentIds) => currentIds.filter((id, index) => index !== indexToRemove)
        
    );
    setShoppingList([]);
    }
    
    const favorites = React.useContext(FavoritesContext);
    const recipeContext = React.useContext(RecipeContext);

    if (!favorites || !recipeContext) {
        throw new Error("FavoritesContext or RecipeContext missing");
    }

    const { likedIds } = favorites;
    const { savedRecipes } = recipeContext;

    const favoriteRecipes = savedRecipes.filter((recipe) => likedIds.includes(recipe.id));
    
    function handleCreateShoppingList() {
        const newShoppingList = createShoppingList(cartIds, savedRecipes);
        setShoppingList(newShoppingList);
    }
    return (
        <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.header}>
                <Text style={styles.favTitle}>Your favorites! </Text>
                <Text style={styles.underTitle}>{favoriteRecipes.length} saved recipes!</Text>
            </View>
            <View style={styles.layout}>
                <View style={styles.grid}>
                    {favoriteRecipes.length === 0 && 
                    (<Text style={styles.textEmpty}>
                        You haven't favorited any recipes yet!
                    </Text>)}
                    {favoriteRecipes.map((r) => (
                    <RecipeCard key={r.id} recipe={r} showAddButton={true} onAdd={addToCart} />
                ))}
                </View>
                <View style={styles.cart}>
                    <Text>Cart</Text>
                    <Text>Selected Recipes: {cartIds.length}</Text>
                    <View>
                    <TouchableOpacity style={[styles.createShoppingListButton,
                        cartIds.length === 0 && {opacity: 0.4},
                    ]}
                        onPress={handleCreateShoppingList}
                        disabled={cartIds.length === 0}
                        >
                        <Text style={{ color: colors.white }}>Create Shopping List</Text>
                    </TouchableOpacity>
                    </View>
                    {shoppingList.length > 0 && (
                        <View>
                            <Text>Shopping List</Text>
                            {shoppingList.map((item) => (
                                <Text key={item.ingredientId + "-" + item.unit}>
                                    {item.name} - {item.quantity} {item.unit}
                                </Text>
                            ))}
                        </View>
                    )}
                    {cartIds.map((id, index) => {
                        const recipe = savedRecipes.find((r) => r.id === id);
                        if (!recipe) return null;
                        
                    return <RecipeCard key={index} recipe={recipe} showAddButton={true} onAdd={() => removeFromCart(index)} />;
                    })}
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textEmpty: {
    color: colors.secondarytext,
    fontSize: 16,
    lineHeight: 24,
    padding: 14,

    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        gap: 6,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 15,
    },
    favTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.text,
    },
    underTitle: {
        fontSize: 16,
        color: colors.secondarytext,
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
        backgroundColor: colors.background,
        borderRadius: 12,
        gap: 10,
        borderWidth: 2,
        borderColor: colors.black,
    },
    createShoppingListButton: {
        backgroundColor: colors.maindark,
        color: colors.white,
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
    }
});

