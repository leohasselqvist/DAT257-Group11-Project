
import type { Recipe, RecipeFilters } from "../../api/types";

export function filterRecipes(
  recipes: Recipe[],
  filters: RecipeFilters
): Recipe[] {
  const query = filters.search?.trim().toLowerCase() ?? "";

  const result = recipes.filter((recipe) => {
    if (query) {
      const name = recipe.name?.toLowerCase() ?? "";
      const description = recipe.description?.toLowerCase() ?? "";

      if (!name.includes(query) && !description.includes(query)) {
        return false;
      }
    }

    if (filters.meal_type && recipe.meal_type !== filters.meal_type) {
      return false;
    }

    if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
      return false;
    }

    if (
      filters.difficulty &&
      recipe.difficulty !== filters.difficulty
    ) {
      return false;
    }

    if (
      filters.dietary_tags &&
      recipe.dietary_tags !== filters.dietary_tags
    ) {
      return false;
    }

    if (
      filters.prep_time_min !== undefined &&
      recipe.prep_time < filters.prep_time_min
    ) {
      return false;
    }

    if (
      filters.prep_time_max !== undefined &&
      recipe.prep_time > filters.prep_time_max
    ) {
      return false;
    }

    if (
      filters.cook_time_min !== undefined &&
      recipe.cook_time < filters.cook_time_min
    ) {
      return false;
    }

    if (
      filters.cook_time_max !== undefined &&
      recipe.cook_time > filters.cook_time_max
    ) {
      return false;
    }

    if (
      filters.calories_per_serving_min !== undefined &&
      recipe.calories_per_serving < filters.calories_per_serving_min
    ) {
      return false;
    }

    if (
      filters.calories_per_serving_max !== undefined &&
      recipe.calories_per_serving > filters.calories_per_serving_max
    ) {
      return false;
    }

    if (
      filters.protein_min !== undefined &&
      recipe.protein < filters.protein_min
    ) {
      return false;
    }

    if (
      filters.protein_max !== undefined &&
      recipe.protein > filters.protein_max
    ) {
      return false;
    }

    return true;
  });

  if (!filters.sort) {
    return result;
  }

  const direction = filters.order === "desc" ? -1 : 1;

  return [...result].sort((a, b) => {
    let comparison = 0;

    switch (filters.sort) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "prep_time":
        comparison = a.prep_time - b.prep_time;
        break;
      case "cook_time":
        comparison = a.cook_time - b.cook_time;
        break;
      case "calories_per_serving":
        comparison =
          a.calories_per_serving - b.calories_per_serving;
        break;
      case "protein":
        comparison = a.protein - b.protein;
        break;
    }

    return comparison * direction;
  });
}
