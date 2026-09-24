import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RECIPES = [
    {
        id: 1,
        title: "Creamy Garlic Chicken",
        category: "Dinner",
        calories: 520, /*skrivs över med beräkning nedan om felaktigt*/
        protein: 35,
        carbs: 20,
        fat: 30,
        time: "30 min",
    },
    {
        id: 2,
        title: "Avocado Egg Toast",
        category: "Breakfast",
        calories: 340,
        protein: 15,
        carbs: 25,
        fat: 10,
        time: "10 min",
    },
    {
        id: 3,
        title: "Mediterranean Bowl",
        category: "Vegetarian",
        calories: 430,
        protein: 20,
        carbs: 50,
        fat: 15,
        time: "20 min",
    },
];

type RecipeItemProps = { title: string; time: string; calories: number; protein: number; carbs: number; fat: number; onPress: () => void };

const RecipeItem = ({ title, time, calories, onPress }: RecipeItemProps) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
        styles.recipeCard,
        pressed && styles.recipeCardPressed,
        ]}
    >
        <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text style={styles.recipeCals}>{calories} kcal</Text>
        <Text style={styles.recipeTime}>{time}</Text>
        </View>
    </Pressable>
);

export default function RecipeMenu() {
    return (
        <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.grid}>
            {RECIPES.map((item) => (
            <RecipeItem
                key={item.id}
                title={item.title}
                time={item.time}
                calories={item.calories}
                protein={item.protein}
                carbs={item.carbs}
                fat={item.fat}
                onPress={() => alert(`${item.title} full macronutrient breakdown: \nCalories: ${item.calories} kcal \nProtein: ${item.protein}g \nCarbohydrates: ${item.carbs}g \nFat: ${item.fat}g`)}
            />
            ))}
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F5",
    },
    grid: {
        padding: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
    },
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
    }
});