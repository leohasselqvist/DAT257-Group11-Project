import { FetchRecipeAPI } from "./apiClient";
import { Recipe, RecipeFilters, RecipeResponse } from "./types";




export async function getRecipes(filters?: RecipeFilters): Promise<RecipeResponse> {
  const query = new URLSearchParams({
  });

  // Append filter parameters to the query
   if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query.set(key, value.toString());
      }
    });
  }

  return FetchRecipeAPI<RecipeResponse>("api/v1/recipes", query);
}

//Get a recipe based on recipeId
export async function getRecipeById(id: number): Promise<Recipe> {
  const response = await FetchRecipeAPI<{ data: Recipe }>(
    "api/v1/recipes/" + id
  );
  return response.data;
}