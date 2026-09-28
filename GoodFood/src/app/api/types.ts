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