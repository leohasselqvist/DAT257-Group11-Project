// export interface FoodProps {
// 		id: number;
// 		name: string;
// 		brand: string;
// 		barcode: string;
// 		calories_kcal: number;
// 		carbs_g: number;
// 		fat: number;
// 		protein_g: number;
// 		suger_g: number;
// 		image_url: string;
// 	}

// export interface APIResponse<T> {
//   data: T;
//   status: string;
// }


// Above is for dietly api, below is for recipe api

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
  difficulty: Difficulty;
  meal_type: MealType;
  cuisine: Cuisine;
  dietary_tags: DietaryTags;

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


export enum Cuisine {
  american = "american",
  chinese = "chinese",
  french = "french",
  greek = "greek",
  italian = "italian",
  japanese = "japanese",
  mexican = "mexican",
  thai = "thai",
  turkish = "turkish",
}

export enum MealType {
  starter = "starter",
  main = "main",
  dessert = "dessert",
  appetizer = "appetizer",
  breakfast = "breakfast",
  brunch = "brunch",
  snack = "snack",
  side_dish = "side_dish",
  soup = "soup",
  drink = "drink",
  sauce = "sauce",
}

export enum Difficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

export enum DietaryTags {
  vegetarian = "vegetarian",
  vegan = "vegan",
  gluten_free = "gluten_free",
  dairy_free = "dairy_free",
  nut_free = "nut_free",
  halal = "halal",
  kosher = "kosher",
}

export enum Sort {
  name = "name",
  prep_time = "prep_time",
  cook_time = "cook_time",
  calories = "calories_per_serving",
  protein = "protein",
}

export enum Order {
  asc = "asc",
  desc = "desc",
}

export interface RecipeFilters {
  search?: string;
  serach_in?: string; 
//   ingredients?: string;
  cuisine?: Cuisine;
  meal_type?: MealType;
  difficulty?: Difficulty;
  dietary_tags?: DietaryTags;

  prep_time_min?: number;
  prep_time_max?: number;
  cook_time_min?: number;
  cook_time_max?: number;

  calories_per_serving_min?: number;
  calories_per_serving_max?: number;

  protein_min?: number;
  protein_max?: number;

  sort?: Sort;
  order?: Order;

  per_page?: number;
  page?: number;
}