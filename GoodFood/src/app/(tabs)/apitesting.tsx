import { useEffect } from "react";
import { Text, View } from "react-native";
import { getRecipes } from "../../api/recipeApi";

export default function ApiTesting() {
  useEffect(() => {
    async function testRecipes() {
      try {
        const response = await getRecipes(1, 10);

     
        console.log("Number of recipes:", response.data.length);
        console.log("First recipe name:", response.data[0]?.name);

        for (const ingredient of response.data[0]?.ingredients || []) {
          console.log("Ingredient:", ingredient.name, "Quantity:", ingredient.quantity, "Unit:", ingredient.unit);
        }
        // console.log("First recipe ingredients:", response.data[0]?.ingredients);
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