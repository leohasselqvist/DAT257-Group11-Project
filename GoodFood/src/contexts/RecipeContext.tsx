import React from "react";
import type { Recipe } from "../components/RecipeCard";

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
    return (
        <RecipeContext.Provider value={{ savedRecipes, saveRecipe}}>
            {children}
        </RecipeContext.Provider>
    );
}