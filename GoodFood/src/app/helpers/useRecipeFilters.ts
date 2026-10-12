
import { useMemo, useState } from "react";
import type { Recipe, RecipeFilters } from "../../api/types";
import { filterRecipes } from "./filterRecipes";

export function useRecipeFilters(recipes: Recipe[]) {
  const [filters, setFilters] = useState<RecipeFilters>({});

  function updateFilter<K extends keyof RecipeFilters>(
    key: K,
    value: RecipeFilters[K] | undefined
  ) {
    setFilters((previous) => {
      const next = { ...previous };

      if (value === undefined || value === "") {
        delete next[key];
      } else {
        next[key] = value as never;
      }

      return next;
    });
  }

  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, filters),
    [recipes, filters]
  );

  function clearFilters() {
    setFilters({});
  }

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredRecipes,
  };
}
