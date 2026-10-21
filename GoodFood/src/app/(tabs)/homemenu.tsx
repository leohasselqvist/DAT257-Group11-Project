import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView, /*grupperar, strukturerar och stylar andra komponenter*/
  StyleSheet, /*möjliggör scroll*/
  Text, /*visa och styla text*/
  TextInput, /*inmatning*/
  TouchableOpacity, /*osynlig knapp som tonar*/
  View, /*grupperar, strukturerar och stylar andra komponenter*/
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecipes } from "../../api/recipeApi";
import type { RecipeIngredient } from "../../api/types";
import {
  Cuisine,
  DietaryTags,
  Difficulty,
  MealType,
  RecipeFilters,
} from "../../api/types";
import { RecipeCard } from "../../components/RecipeCard";
import { colors } from "../../constants/colors";
type CategoryKey = "All" | "Breakfast" | "Lunch & Dinner" | "Light meal" | "Snack";

const categoryButtons: Array<{ label: CategoryKey; apiValue?: MealType }> = [
  { label: "All" },
  { label: "Breakfast", apiValue: MealType.breakfast },
  { label: "Lunch & Dinner", apiValue: MealType.main },
  { label: "Light meal", apiValue: MealType.snack },
  { label: "Snack", apiValue: MealType.snack },
];

type RecipeUI = {
  id: number;
  title: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  ingredients?: RecipeIngredient[];
  instructions?: string[];
};

function mapApiRecipeToCard(apiRecipe: any): RecipeUI {
  const rawMealType = apiRecipe.meal_type;

  let category: CategoryKey = "Lunch & Dinner";
  if (rawMealType === MealType.breakfast) category = "Breakfast";
  else if (rawMealType === MealType.snack) category = "Snack";
  else if (rawMealType === MealType.main) category = "Lunch & Dinner";

  return {
    id: apiRecipe.id,
    title: apiRecipe.name ?? "Unnamed recipe",
    category,
    calories: apiRecipe.calories_per_serving ?? 0,
    protein: apiRecipe.protein ?? 0,
    carbs: apiRecipe.carbs ?? 0,
    fat: apiRecipe.fat ?? 0,
    time: `${(apiRecipe.prep_time ?? 0) + (apiRecipe.cook_time ?? 0)} min`,
    ingredients: Array.isArray(apiRecipe.ingredients)
      ? apiRecipe.ingredients.map((ingredient: any) => ({
          id: ingredient.id, //Is needed to identify the ingredient in the shopping list.
          name: ingredient.name ?? "Ingredient",
          quantity: ingredient.quantity ?? "",
          unit: ingredient.unit ?? "",
        }))
      : [],
    instructions: Array.isArray(apiRecipe.instructions)
      ? apiRecipe.instructions
      : [],
  };
}

function RecipeMenu({ items }: { items: RecipeUI[] }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <RecipeCard key={item.id} recipe={item} />
      ))}
    </View>
  );
}

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: T[];
  selected?: T;
  onSelect: (value: T | undefined) => void;
}) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option) => {
          const active = selected === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(active ? undefined : option)}
            >
              <Text style={[styles.categoryButton, active && styles.categoryButtonSelected]}>
                {option.replace(/_/g, " ")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryKey>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [recipes, setRecipes] = React.useState<any[]>([]); 
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const [filters, setFilters] = React.useState<RecipeFilters>({});   // applied filters
  const [draft, setDraft] = React.useState<RecipeFilters>({});       // edited inside the popup
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  async function fetchRecipes(
    nextPage: number = page,
    activeFilters: RecipeFilters = filters,
    reset: boolean = false
  ) {
    try {
      setLoading(true);

      const response = await getRecipes({
        ...activeFilters,
        per_page: 10,
        page: nextPage,
      });

      const mapped = (response.data ?? []).map(mapApiRecipeToCard);

      setRecipes((prev) => {
        const base = reset ? [] : prev;
        const seen = new Set(base.map((r) => r.id));
        return [...base, ...mapped.filter((r) => !seen.has(r.id))];
      });
      setPage(nextPage + 1);
      setHasMore(response.meta.current_page < response.meta.last_page);
    } catch (error) {
      console.error("Failed to load recipes:", error);
    } finally {
      setLoading(false);
    }
  }

  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    void fetchRecipes(1, {}, true);
  }, []);

  function openFilters() {
    setDraft(filters);
    setFilterVisible(true);
  }

  function applyFilters() {
    setFilters(draft);
    setFilterVisible(false);
    void fetchRecipes(1, draft, true);
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined).length;

  const filteredRecipes = recipes.filter((recipe) =>
    (selectedCategory === "All" || recipe.category === selectedCategory) &&
    recipe.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Image
        source={require('../../../assets/images/goodfood_logo.png')}
        style={styles.logotype}
        resizeMode="contain"
      />
      <Text style={styles.catchPhrase}>Good food for the whole week!</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Welcome, what recipes are you interested in?</Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search recipes..."
            placeholderTextColor={colors.text}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View>
          <Text style={styles.recommended}>Recommended recipes</Text>
        </View>

        <View style={{ flexDirection: "row", paddingHorizontal: 6, paddingVertical: 6 }}>
          <TouchableOpacity onPress={openFilters}>
            <Text style={[styles.categoryButton, activeFilterCount > 0 && styles.categoryButtonSelected]}>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && recipes.length === 0 ? (
          <Text style={{ margin: 12 }}>Loading recipes...</Text>
        ) : (
          <View>
            <RecipeMenu items={filteredRecipes} />
          </View>
        )}

        {hasMore && (
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => void fetchRecipes(page, filters)}
          >
            <Text style={styles.showMoreButton}>{loading ? "Loading..." : "Show more"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        transparent
        visible={filterVisible}
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setFilterVisible(false)}>
          <Pressable style={styles.modalView} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Filters</Text>

              <FilterGroup
                title="Difficulty"
                options={Object.values(Difficulty)}
                selected={draft.difficulty}
                onSelect={(v) => setDraft((d) => ({ ...d, difficulty: v }))}
              />
              <FilterGroup
                title="Meal type"
                options={Object.values(MealType)}
                selected={draft.meal_type}
                onSelect={(v) => setDraft((d) => ({ ...d, meal_type: v }))}
              />
              <FilterGroup
                title="Cuisine"
                options={Object.values(Cuisine)}
                selected={draft.cuisine}
                onSelect={(v) => setDraft((d) => ({ ...d, cuisine: v }))}
              />
              <FilterGroup
                title="Dietary tags"
                options={Object.values(DietaryTags)}
                selected={draft.dietary_tags}
                onSelect={(v) => setDraft((d) => ({ ...d, dietary_tags: v }))}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setDraft({})}>
                  <Text style={styles.clearButton}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={applyFilters}>
                  <Text style={styles.applyButton}>Apply</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logotype: {
    width: 140,
    height: 140,
  },
  catchPhrase: {
    fontSize: 35,
    fontWeight: "700",
    color: colors.maindark,
    flexShrink: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: "center",
  },
  
  grid: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  title: {
    paddingHorizontal: 6,
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  recommended: {
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondarytext,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.buttons,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.black,
    borderEndWidth: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 6,
    backgroundColor: colors.white,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    fontSize: 15,
    color: colors.black,
    borderEndEndRadius: 1,
  },
  categoryButtonSelected: {
    backgroundColor: colors.brown,
    borderColor: colors.black,
  },
  showMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.main,
    color: colors.white,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  filterGroup: { marginBottom: 16 },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  filterOptions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: colors.background,
    borderRadius: 20,
    borderColor: colors.black,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  clearButton: {
    textAlign: "center",
    padding: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.borders,
    color: colors.text,
    fontWeight: "bold",
  },
  applyButton: {
    textAlign: "center",
    padding: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.maindark,
    color: colors.white,
    fontWeight: "bold",
  },
});