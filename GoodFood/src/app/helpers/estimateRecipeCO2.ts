import { estimateIngredientCO2 } from "../../api/climatiq";
import type { RecipeIngredient } from "../../api/types";
import toKg from "./unitConversion";

export interface IngredientCO2Estimate {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  co2eKg: number | null;
  matchedFactorName?: string;
  error?: string;
}

export interface RecipeCO2Estimate {
  ingredients: IngredientCO2Estimate[];
  totalCO2eKg: number;
  estimatedCount: number;
  totalCount: number;
  coveragePercentage: number;
}

export async function estimateRecipeCO2(
  ingredients: RecipeIngredient[]
): Promise<RecipeCO2Estimate> {
  const results: IngredientCO2Estimate[] = [];

  for (const ingredient of ingredients) {
    const weightKg = toKg(ingredient.quantity, ingredient.unit);

    if (weightKg === null) {
      results.push({
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        co2eKg: null,
        error: "Unsupported unit",
      });
      continue;
    }

    try {
      const estimate = await estimateIngredientCO2(
        ingredient.name,
        weightKg
      );

      results.push({
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        co2eKg: estimate.co2eKg,
        matchedFactorName: estimate.matchedFactorName,
        error: estimate.error,
      });
    } catch (error) {
      results.push({
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        co2eKg: null,
        error:
          error instanceof Error
            ? error.message
            : "Estimation failed",
      });
    }
  }

  const estimated = results.filter(
    (ingredient) => ingredient.co2eKg !== null
  );

  return {
    ingredients: results,
    totalCO2eKg: estimated.reduce(
      (sum, ingredient) => sum + ingredient.co2eKg!,
      0
    ),
    estimatedCount: estimated.length,
    totalCount: results.length,
    coveragePercentage:
      results.length === 0
        ? 0
        : (estimated.length / results.length) * 100,
  };
}