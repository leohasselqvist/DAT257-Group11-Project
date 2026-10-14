import { rapidApiKey, recipeApiKey } from "./secret" // IF YOU GET AN ERROR HERE DM LEO

// Api Client

// The lowest level of the API layers, sending base requests. 

export async function FetchRecipeAPI<T>(endpoint: string, query?: URLSearchParams) {
  const baseURL = "https://recipeapi.io/";
  const url = new URL(endpoint, baseURL);
  if (query) url.search = query.toString();
    console.log("query: ", query);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${recipeApiKey}` },
  });

  if (!response.ok) {
    throw new Error(`[RecipeAPI] Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
export async function FetchEdamam<T>(endpoint: string, params?: RequestInit) {
  const rapidBaseUrl = 'edamam-edamam-nutrition-analysis.p.rapidapi.com';
  const r = await fetch(
    `https://${rapidBaseUrl}/${endpoint}`, // Build the basic request, eg. getdietly.com/search
    {...params,  // Add the paramaters, "..." just means to spread the data so we don't create a dict inside of a dict.
      headers: { 

        "x-rapidapi-host": `${rapidBaseUrl}`,
        "x-rapidapi-key": `${rapidApiKey}`, 
        "x-rapidapi-ua": 'RapidAPI-Playground',
        ...params?.headers // Since we overwrite the headers above, we readd them here.
      }});
  
  if (!r.ok) {
    throw new Error(`[API] Dietly Error: ${r.status}`)
  }

  return r.json();
}