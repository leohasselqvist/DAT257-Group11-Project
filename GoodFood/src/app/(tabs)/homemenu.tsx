
import {
  Image,
  ScrollView,
  StyleSheet,
  Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RecipeFilters from "../../components/RecipeFilters";
import RecipeResults from "../../components/RecipeResults";
import RecipeSearchBar from "../../components/RecipeSearchBar";

import { useRecipeFilters } from "../helpers/useRecipeFilters";
import { useRecipes } from "../helpers/useRecipes";

import { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import * as api from "../../databaseAPI/API";

export default function HomeScreen() {
  const {
    recipes,
    loading,
    error,
    hasMore,
    loadMore,
  } = useRecipes();

  const {
    filters,
    updateFilter,
    clearFilters,
    filteredRecipes,
  } = useRecipeFilters(recipes);

  const [userId, setUserId] = useState<number | null>(null);
  const favoritesContext = useContext(FavoritesContext);

  useEffect(() => {
    let cancelled = false;

    async function initializeUser() {
      try {
        const username = "development-user";

        console.log("[HomeScreen] Getting database user ID:", username);

        const id = await api.addUser(username);

        if (id <= 0) {
          throw new Error(`Invalid user ID returned: ${id}`);
        }

        if (cancelled) return;

        setUserId(id);
        console.log("[HomeScreen] Database user ID:", id);

        const favouriteIds = await api.getFavouriteRecipes(id);

        if (cancelled) return;

        favoritesContext?.setLikedIds(favouriteIds);
        console.log("[HomeScreen] Loaded favourite recipe IDs:", favouriteIds);
      } catch (error) {
        console.error("[HomeScreen] Failed to initialize user:", error);
      }
    }

    void initializeUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Image
          source={require("../../../assets/images/Goodfood_logo_v1.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="GoodFood logo"
        />

        <Text style={styles.title}>
          Welcome, what recipes are you interested in?
        </Text>

        <RecipeSearchBar
          value={filters.search ?? ""}
          onChange={(value) => updateFilter("search", value)}
        />

        <RecipeFilters
          filters={filters}
          onUpdate={updateFilter}
          onClear={clearFilters}
        />

        <Text style={styles.sectionTitle}>
          Recommended recipes
        </Text>

        <RecipeResults
          recipes={filteredRecipes}
          userId={userId}
          loading={loading}
          error={error}
          hasMore={hasMore}
          hasLoadedRecipes={recipes.length > 0}
          onLoadMore={() => void loadMore()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F5",
  },
  content: {
    paddingBottom: 24,
  },
  logo: {
    width: 200,
    height: 80,
    marginVertical: 16,
    alignSelf: "center",
  },
  title: {
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "900",
    color: "#252824",
  },
  sectionTitle: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#252824",
  },
});
