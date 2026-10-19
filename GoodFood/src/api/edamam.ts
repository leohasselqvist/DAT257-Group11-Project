import { useState, useEffect } from "react";
import { NutritionDataProps } from "./types";
import { Edamam } from "./apiService";

export function Search(ingr: string | undefined) {
    const [nutritionData, setNutritionData] = useState<NutritionDataProps |  null >(null)
    const getFoods = async () => {
        if (!ingr) {
            return;
        }

        const r = await Edamam.GetNutritionFromIngredients(ingr);
        setNutritionData(r.data);

    }

    useEffect(() => {
            getFoods();
        })

    return {nutritionData}
    }