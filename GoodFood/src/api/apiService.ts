import { FetchEdamam } from "./apiClient";
import { APIResponse, NutritionDataProps } from "./types";

export namespace Edamam {
  export function GetNutritionFromIngredients(ingr: string) {
    return FetchEdamam<APIResponse<NutritionDataProps>>(`api/nutrition-data?nutrition-type=cooking&ingr=${ingr.replaceAll(' ', '%20')}`);
  }
}
export namespace OtherAPI {  // bytt namn här

//   // lägg funktioner här

}
