import React from "react";
import {
  ScrollView,               /*möjliggör scroll*/
  Text,                     /*visa och styla text*/
  TextInput,                /*inmatning*/
  TouchableOpacity,         /*osynlig knapp som tonar*/
  View,                      /*grupperar, strukturerar och stylar andra komponenter*/
  StyleSheet,
  Image,
} from "react-native";
import { recipes } from "../../data/recipes";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../../components/RecipeCard";
import { getRecipes } from "../../api/recipeApi";
import { MealType } from "../../api/types";

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
  ingredients?: Array<{
    name: string;
    quantity?: number | string;
    unit?: string;
  }>;
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

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryKey>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  async function fetchRecipes(category: CategoryKey = selectedCategory, nextPage: number = page) {
  try {
    setLoading(true);

    const response = await getRecipes({
      per_page: 10,
      page: nextPage,
    });

    const mapped = (response.data ?? []).map(mapApiRecipeToCard);

    setRecipes((prev) => {
      const seen = new Set(prev.map((r) => r.id));
      return [...prev, ...mapped.filter((r) => !seen.has(r.id))];
    });
    setPage(nextPage + 1);
  } catch (error) {
    console.error("Failed to load recipes:", error);
    // no setRecipes([]) here, so a failed "Show more" keeps the list
  } finally {
    setLoading(false);
  }
}

  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    void fetchRecipes("All", 1);
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    (selectedCategory === "All" || recipe.category === selectedCategory) &&
    recipe.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/images/Goodfood_logo_v1.png')}
        style={{
          width: 200,
          height: 80,
          marginVertical: 16,
        }}
        resizeMode="contain"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Welcome, what recipes are you interested in?</Text>
        </View>

        <View>
          <TextInput
            style={styles.searchBar}
            placeholder="Search recipes..."
            placeholderTextColor="#9A9D96"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.buttonGap}>
            {categoryButtons.map((category) => (
              <TouchableOpacity
                key={category.label}
                activeOpacity={0.2}
                onPress={() => {
                  setSelectedCategory(category.label);
                }}
              >
                <Text
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.label && styles.categoryButtonSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View>
          <Text style={styles.recommended}>Recommended recipes</Text>
        </View>

        {loading ? (
          <Text style={{ margin: 12 }}>Loading recipes...</Text>
        ) : (
          <View>
            <RecipeMenu items={filteredRecipes} />
          </View>
        )}
        <TouchableOpacity style={{alignSelf: "center"}} onPress={() => void fetchRecipes("All", page)}>
          <Text style={styles.showMoreButton}>{loading ? "Loading..." : "Show more"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F5",
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
    color: "#252824",
  },
  recommended: {
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#252824",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  buttonGap: {
    padding: 6,
    gap: 6,
    flexDirection: "row",
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    fontSize: 15,
    color: "#252824",
  },
  categoryButtonSelected: {
    backgroundColor: "#E8F2FF",
    borderColor: "#8DB9FF",
  },
  showMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,

  },
});