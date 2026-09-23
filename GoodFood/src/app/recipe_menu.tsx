import { View, FlatList, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RECIPES = [
    { id: "1", title: "Pasta carbonara" },
    { id: "2", title: "Chicken curry" },
    { id: "3", title: "Greek salad" },
];

type RecipeItemProps = { title: string; onPress: () => void };

const RecipeItem = ({ title, onPress }: RecipeItemProps) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.recipe_list_item,
            pressed && styles.recipe_list_item_pressed,
        ]}
    >
        <Text style={styles.title}>{title}</Text>
    </Pressable>
);

export default function RecipeMenu() {
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={RECIPES}
                renderItem={({ item }) => (
                    <RecipeItem title={item.title}
                    onPress={() => alert('You pressed a button.')}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
    },
    recipe_list_item: {
        backgroundColor: "#1c1f22",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    title: {
        color: "#fff",
        fontSize: 20,
    },
    recipe_list_item_pressed: {
        opacity: 0.6,
    },
});