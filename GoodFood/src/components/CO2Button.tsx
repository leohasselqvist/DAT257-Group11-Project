import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";

import type { RecipeIngredient } from "../api/types";
import { estimateRecipeCO2 } from "../app/helpers/estimateRecipeCO2";

interface CO2ButtonProps {
  ingredients: RecipeIngredient[];
}

export function CO2Button({ ingredients }: CO2ButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    setLoading(true);

    try {
      const result = await estimateRecipeCO2(ingredients);

      const details = result.ingredients
        .map((ingredient) => {
          const amount =
            `${ingredient.quantity} ${ingredient.unit} ` +
            ingredient.ingredientName;

          if (ingredient.co2eKg === null) {
            return `${amount}: ${ingredient.error ?? "Not found"}`;
          }

          return (
            `${amount}: ${ingredient.co2eKg.toFixed(4)} kg CO2e\n` +
            `Factor: ${ingredient.matchedFactorName}`
          );
        })
        .join("\n\n");

      Alert.alert(
        "Recipe CO2 estimate",
        `Total: ${result.totalCO2eKg.toFixed(3)} kg CO2e\n` +
          `Coverage: ${result.estimatedCount}/${result.totalCount} ingredients\n\n` +
          details
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Could not estimate emissions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading}
      style={{
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#E5F0E8",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text>Estimate CO₂ footprint</Text>
      )}
    </TouchableOpacity>
  );
}