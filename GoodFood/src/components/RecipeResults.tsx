
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Recipe } from "../api/types";
import { RecipeCard } from "./RecipeCard";

type RecipeResultsProps = {
  recipes: Recipe[];
  userId: number | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  hasLoadedRecipes: boolean;
  onLoadMore: () => void;
};

export default function RecipeResults({
  recipes,
  userId,
  loading,
  error,
  hasMore,
  hasLoadedRecipes,
  onLoadMore,
}: RecipeResultsProps) {
  return (
    <View>
      {recipes.length > 0 && (
        <View style={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              userId={userId}
            />
          ))}
        </View>
      )}

      {error && (
        <View style={styles.message}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onLoadMore}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!error && recipes.length === 0 && !loading && (
        <Text style={styles.messageText}>
          {hasLoadedRecipes
            ? "No recipes match your search."
            : "No recipes available."}
        </Text>
      )}

      {loading && (
        <Text style={styles.messageText}>Loading recipes...</Text>
      )}

      {!loading && !error && hasMore && (
        <TouchableOpacity
          style={styles.button}
          onPress={onLoadMore}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Show more</Text>
        </TouchableOpacity>
      )}

      {!loading && !error && !hasMore && hasLoadedRecipes && (
        <Text style={styles.messageText}>
          You've reached the end of the recipes.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  message: {
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  messageText: {
    margin: 16,
    color: "#62665F",
    textAlign: "center",
  },
  errorText: {
    color: "#B42318",
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    marginVertical: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEDE8",
  },
  buttonText: {
    color: "#252824",
    fontWeight: "600",
  },
});
