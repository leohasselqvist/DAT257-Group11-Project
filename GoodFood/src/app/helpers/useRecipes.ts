
import { useCallback, useEffect, useRef, useState } from "react";
import { getRecipes } from "../../api/recipeApi";
import type { Recipe } from "../../api/types";

const PAGE_SIZE = 10;

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const nextPage = useRef(1);
  const hasMoreRef = useRef(true);
  const requestInProgress = useRef(false);

  const loadMore = useCallback(async () => {
    if (requestInProgress.current || !hasMoreRef.current) {
      return;
    }

    requestInProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await getRecipes({
        page: nextPage.current,
        per_page: PAGE_SIZE,
      });

      const fetchedRecipes = Array.isArray(response.data)
        ? response.data
        : [];

      setRecipes((current) => {
        const existingIds = new Set(current.map((recipe) => recipe.id));

        return [
          ...current,
          ...fetchedRecipes.filter(
            (recipe) => !existingIds.has(recipe.id)
          ),
        ];
      });

      const currentPage = nextPage.current;
      nextPage.current = currentPage + 1;

      const morePagesAvailable =
        typeof response.meta?.last_page === "number"
          ? currentPage < response.meta.last_page
          : fetchedRecipes.length === PAGE_SIZE;

      hasMoreRef.current = morePagesAvailable;
      setHasMore(morePagesAvailable);
    } catch (err) {
      console.error("Failed to load recipes:", err);
      setError("Could not load recipes. Please try again.");
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMore();
  }, [loadMore]);

  return { recipes, loading, error, hasMore, loadMore };
}
