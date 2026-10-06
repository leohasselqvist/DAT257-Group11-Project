import { FetchRecipeAPI } from "./apiClient";
import { Recipe, RecipeResponse } from "./types";




export async function getRecipes(page = 1, perPage = 10): Promise<RecipeResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  return FetchRecipeAPI<RecipeResponse>("api/v1/recipes", query);
}
