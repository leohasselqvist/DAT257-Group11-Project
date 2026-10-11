import { useState, useEffect } from "react";
import { DietlyAPI } from "./apiService";
import { FoodProps } from "./types";

export function Search(name: string | undefined, limit: number | undefined) {
    const [foods, setFood] = useState<FoodProps[] |  null >(null)
    const getFoods = async () => {
        if (!name || !limit) {
            return;
        }

        const r = await DietlyAPI.Search(name, limit);
        setFood(r.data);

    }

    useEffect(() => {
            getFoods();
        })

    return {foods}

}

export function Popular() {
    const [foods, setFoods] = useState<FoodProps[] | null>(null)
    const getFoods = async () => {
        const r = await DietlyAPI.Popular();
        setFoods(r.data);
    }

    useEffect(() => {
            getFoods();
        })

    return {foods}
}

/*export default async function Search(query: string, results: number) { // String is what you are searching for, results is how many recipes you would like to see in return,
    const r = await fetch(`https://api.getdietly.com/search?q=${query.replaceAll(" ", "+").toLowerCase()}&limit=${results}`);
    if (!r.ok) {throw new Error(`[API] Dietly Error: ${r.status}`)};
    const result = await r.json();
    return result
}*/