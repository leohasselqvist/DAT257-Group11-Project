import React from "react";
import { getRecipeById } from "../api/recipeApi";
import type { Recipe } from "../components/RecipeCard";
import { getFavouriteRecipes } from "../databaseAPI/API";
import { getCurrentUserId } from "./UserContext";
type RecipeContextType = { 
    savedRecipes: Recipe[]; //Stores saved recipes inclding ingredients.
    saveRecipe: (recipe: Recipe) => void; //function for storing recipes in savedRecipes.
    };

export const RecipeContext = React.createContext<RecipeContextType | undefined>(undefined);


export function RecipeProvider({ children, }: { children: React.ReactNode }) {
    const [savedRecipes, setSavedRecipes] = React.useState<Recipe[]>([]);

    function saveRecipe(recipe: Recipe) { //Lägger till ett recept.
        setSavedRecipes((currentRecipes) => {
            const recipeExists = currentRecipes.some((savedRecipe) => savedRecipe.id === recipe.id);

        if (recipeExists) {
            return currentRecipes;
        }

        return [...currentRecipes, recipe];

    });
}
    React.useEffect(() => {
        const userId = getCurrentUserId();
        
        if (userId === null){
            return;
        }
        getFavouriteRecipes(userId)
        .then(async (ids) => {
            for (const recipeId of ids) {
                const apiRecipe = await getRecipeById(recipeId);

                saveRecipe({
                    id: apiRecipe.id,
                    title: apiRecipe.name,
                    calories: apiRecipe.calories_per_serving,
                    protein: apiRecipe.protein,
                    time: `${apiRecipe.prep_time + apiRecipe.cook_time} min`,
                    ingredients: apiRecipe.ingredients,
                    instructions: apiRecipe.instructions,
                });
            }
        })
        .catch((error) => {
          console.error("Kunde inte hämta favoritrecept:", error);
        });
    }, []);
    
    return (
        <RecipeContext.Provider value={{ savedRecipes, saveRecipe}}>
            {children}
        </RecipeContext.Provider>
    );
}