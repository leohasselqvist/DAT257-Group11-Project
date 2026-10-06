export interface FoodProps {
		id: number;
		name: string;
		brand: string;
		barcode: string;
		calories_kcal: number;
		carbs_g: number;
		fat: number;
		protein_g: number;
		suger_g: number;
		image_url: string;
	}

export interface APIResponse<T> {
  data: T;
  status: string;
}


export interface RecipeIngredient {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  optional: boolean;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  meal_type: string;
  cuisine: string;
  dietary_tags: string[];

  servings: number;
  prep_time: number;
  cook_time: number;

  calories_per_serving: number;
  protein: number;

  instructions: string[];
  ingredients: RecipeIngredient[];
}

export interface RecipeResponse {
  data: Recipe[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    path: string;
    per_page: number;
    total: number;
    language: string;
  };
}