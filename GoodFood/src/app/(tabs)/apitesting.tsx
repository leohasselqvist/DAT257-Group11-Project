import { useEffect } from "react";
import { Text, View } from "react-native";
import { getRecipes } from "../../api/recipeApi";
import { Difficulty,  DietaryTags, Sort, Order } from "../../api/types";

export default function ApiTesting() {
  useEffect(() => {
    async function testRecipes() {
      try {
        const response = await getRecipes({
          search: "tomato",
          difficulty: Difficulty.easy,
          dietary_tags: DietaryTags.vegetarian,
          sort: Sort.calories,
          order: Order.desc,
          page: 10,
          per_page: 2
        });

        console.log(
          "Filtered recipes:",
          JSON.stringify(response, null, 2)
        );

        console.log("Number of recipes:", response.data.length);
        console.log("First recipe name:", response.data[0]?.name);
        
        // console.log("First recipe ingredients:", response.data[0]?.ingredients);
        for (const ingredient of response.data[0]?.ingredients || []) {
          console.log("Ingredient:", ingredient.name, "Quantity:", ingredient.quantity, "Unit:", ingredient.unit);
        }
        
        // console.log("First recipe instructions:", response.data[0]?.instructions);
        let i = 1;
        for (const instruction of response.data[0]?.instructions || []) {
          console.log(`Instruction ${i}:`, instruction);
          i++;
        }
      
        // console.log("First recipe:", response.data[0]);
        
      } catch (error) {
        console.error("Recipes request failed:", error);
      } 
    }

    void testRecipes();
  }, []);

  return (
    <View>
      <Text>Check the Expo/Metro console for the recipes response.</Text>
    </View>
  );
}