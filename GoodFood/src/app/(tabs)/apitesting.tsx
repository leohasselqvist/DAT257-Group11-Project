// import { useEffect } from "react";
// import { Text, View } from "react-native";
// import { getRecipes } from "../../api/recipeApi";
// import { Difficulty,  DietaryTags, Sort, Order } from "../../api/types";

// export default function ApiTesting() {
//   useEffect(() => {
//     async function testRecipes() {
//       try {
//         const response = await getRecipes({
//           search: "tomato",
//           difficulty: Difficulty.easy,
//           dietary_tags: DietaryTags.vegetarian,
//           sort: Sort.calories,
//           order: Order.desc,
//           page: 10,
//           per_page: 2
//         });

//         console.log(
//           "Filtered recipes:",
//           JSON.stringify(response, null, 2)
//         );

//         console.log("Number of recipes:", response.data.length);
//         console.log("First recipe name:", response.data[0]?.name);
        
//         // console.log("First recipe ingredients:", response.data[0]?.ingredients);
//         for (const ingredient of response.data[0]?.ingredients || []) {
//           console.log("Ingredient:", ingredient.name, "Quantity:", ingredient.quantity, "Unit:", ingredient.unit);
//         }
        
//         // console.log("First recipe instructions:", response.data[0]?.instructions);
//         let i = 1;
//         for (const instruction of response.data[0]?.instructions || []) {
//           console.log(`Instruction ${i}:`, instruction);
//           i++;
//         }
      
//         // console.log("First recipe:", response.data[0]);
        
//       } catch (error) {
//         console.error("Recipes request failed:", error);
//       } 
//     }

//     void testRecipes();
//   }, []);

//   return (
//     <View>
//       <Text>Check the Expo/Metro console for the recipes response.</Text>
//     </View>
//   );
// }



import { useEffect } from "react";
import { Text, View } from "react-native";
import { getRecipes } from "../../api/recipeApi";
import { climatiqKey } from "../../api/secret";
import {
  DietaryTags,
  Difficulty,
  Order,
  Sort,
} from "../../api/types";

const DATA_VERSION = "^38";

type IngredientCarbonResult = {
  name: string;
  quantity: number;
  unit: string;
  co2eKg: number | null;
  matchedFactor: string | null;
  status: "estimated" | "not_found" | "error";
  message?: string;
};

// Approximate conversions for MVP purposes.
// All conversions return grams.
function toGrams(
  quantity: number,
  unit: string
): number | null {
  switch (unit.toLowerCase().trim()) {
    case "g":
    case "gram":
    case "grams":
      return quantity;

    case "kg":
    case "kilogram":
    case "kilograms":
      return quantity * 1000;

    case "ml":
    case "milliliter":
    case "milliliters":
      return quantity;

    case "tbsp":
    case "tablespoon":
    case "tablespoons":
      return quantity * 15;

    case "tsp":
    case "teaspoon":
    case "teaspoons":
      return quantity * 5;

    case "pinch":
    case "pinches":
      return quantity * 0.3;

    case "leaf":
    case "leaves":
      return quantity * 0.5;

    default:
      return null;
  }
}

async function testClimatiq(
  name: string,
  quantity: number,
  unit: string
): Promise<IngredientCarbonResult> {
  const originalQuery = `${quantity} ${unit} ${name}`;

  const result: IngredientCarbonResult = {
    name,
    quantity,
    unit,
    co2eKg: null,
    matchedFactor: null,
    status: "not_found",
  };

  console.log(`\nIngredient query: ${originalQuery}`);

  const grams = toGrams(quantity, unit);

  if (grams === null) {
    result.message = `Unsupported unit: ${unit}`;
    console.log(result.message);
    return result;
  }

  try {
    // 1. Search for emission factors.
    const searchParams = new URLSearchParams({
      query: name,
      data_version: DATA_VERSION,
      access_type: "public",
      results_per_page: "5",
    });

    const searchResponse = await fetch(
      `https://api.climatiq.io/data/v1/search?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${climatiqKey}`,
        },
      }
    );

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      result.status = "error";
      result.message =
        `Search failed with HTTP ${searchResponse.status}`;
      console.log(result.message);
      return result;
    }

    const candidates = searchData.results ?? [];

    // Pick the first public weight-based factor.
    // This does not guarantee that the factor is an exact match.
    const factor = candidates.find(
      (item: any) =>
        item.access_type === "public" &&
        item.unit_type === "Weight"
    );

    if (!factor) {
      result.status = "not_found";
      result.message = "No public weight-based factor found";
      console.log(result.message);
      return result;
    }

    result.matchedFactor = factor.name;

    console.log("Matched factor:", factor.name);
    console.log("Factor source:", factor.source);
    console.log("Factor region:", factor.region);

    // 2. Estimate emissions using the selected factor.
    const estimateResponse = await fetch(
      "https://api.climatiq.io/data/v1/estimate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${climatiqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emission_factor: {
            activity_id: factor.activity_id,
            data_version: DATA_VERSION,
          },
          parameters: {
            weight: grams / 1000,
            weight_unit: "kg",
          },
        }),
      }
    );

    const estimateData = await estimateResponse.json();

    if (!estimateResponse.ok) {
      result.status = "error";
      result.message =
        `Estimate failed with HTTP ${estimateResponse.status}: ` +
        JSON.stringify(estimateData);

      console.log(result.message);
      return result;
    }

    if (
      typeof estimateData.co2e !== "number" ||
      !Number.isFinite(estimateData.co2e)
    ) {
      result.status = "error";
      result.message = "Response did not contain a numeric CO2e value";
      console.log(result.message);
      return result;
    }

    result.co2eKg = estimateData.co2e;
    result.status = "estimated";

    console.log(
      `${originalQuery} -> ${result.co2eKg} kg CO2e`
    );

    return result;
  } catch (error) {
    result.status = "error";
    result.message =
      error instanceof Error ? error.message : "Unknown error";

    console.log("Request failed:", result.message);
    return result;
  }
}

export default function ApiTesting() {
  useEffect(() => {
    let cancelled = false;

    async function testRecipes() {
      try {
        const response = await getRecipes({
          search: "tomato",
          difficulty: Difficulty.easy,
          dietary_tags: DietaryTags.vegetarian,
          sort: Sort.calories,
          order: Order.desc,
          page: 10,
          per_page: 2,
        });

        const recipe = response.data[0];

        if (!recipe) {
          console.log("No recipes found.");
          return;
        }

        console.log(`\nRecipe: ${recipe.name}`);

        const results: IngredientCarbonResult[] = [];

        // Sequential requests: no Promise.all or parallel API calls.
        for (const ingredient of recipe.ingredients) {
          if (cancelled) return;

          console.log(
            `\nOriginal ingredient: ${ingredient.name}, ` +
            `${ingredient.quantity} ${ingredient.unit}`
          );

          const result = await testClimatiq(
            ingredient.name,
            ingredient.quantity,
            ingredient.unit
          );

          results.push(result);
        }

        if (cancelled) return;

        // 3. Print summary and ingredient coverage.
        const estimatedCount = results.filter(
          (item) => item.status === "estimated"
        ).length;

        const notFoundCount = results.filter(
          (item) => item.status === "not_found"
        ).length;

        const errorCount = results.filter(
          (item) => item.status === "error"
        ).length;

        const coverage = results.length
          ? (estimatedCount / results.length) * 100
          : 0;

        const partialTotal = results.reduce(
          (sum, item) => sum + (item.co2eKg ?? 0),
          0
        );

        console.log("\n========== CARBON SUMMARY ==========");
        console.log("Recipe:", recipe.name);
        console.log(
          `Ingredient coverage: ${estimatedCount}/${results.length} ` +
          `(${coverage.toFixed(0)}%)`
        );
        console.log("Not found:", notFoundCount);
        console.log("Errors:", errorCount);
        console.log(
          "Partial estimated footprint:",
          `${partialTotal.toFixed(4)} kg CO2e`
        );
        console.log(
          "NOTE: Partial total excludes ingredients without estimates."
        );

        console.log("\n========== INGREDIENT RESULTS ==========");

        for (const item of results) {
          const original = `${item.quantity} ${item.unit} ${item.name}`;

          if (item.status === "estimated") {
            console.log(
              `[ESTIMATED] ${original} -> ` +
              `${item.co2eKg} kg CO2e | Factor: ${item.matchedFactor}`
            );
          } else {
            console.log(
              `[${item.status.toUpperCase()}] ${original} -> ` +
              `${item.message ?? "No estimate available"}`
            );
          }
        }

        console.log("========================================");
      } catch (error) {
        console.error("Recipe request failed:", error);
      }
    }

    void testRecipes();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View>
      <Text>
        Check the Expo/Metro console for carbon estimates
        and ingredient coverage.
      </Text>
    </View>
  );
}
