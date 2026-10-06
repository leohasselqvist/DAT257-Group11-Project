import { dietlyApiKey, recipeApiKey } from "./secret"; // IF YOU GET AN ERROR HERE DM LEO

// Api Client

// The lowest level of the API layers, sending base requests without 

export async function FetchDietly<T>(endpoint: string, params?: RequestInit) {
  const dietlyBaseURL = 'https://api.getdietly.com/';
  const r = await fetch(
    `${dietlyBaseURL}${endpoint}`, // Build the basic request, eg. getdietly.com/search
    {...params,  // Add the paramaters, "..." just means to spread the data so we don't create a dict inside of a dict.
      headers: { 

        Authorization: `Bearer ${dietlyApiKey}`, // IF YOU GET AN ERROR HERE DM LEO
        ...params?.headers // Since we overwrite the headers above, we readd them here.
      }});
  
  if (!r.ok) {
    throw new Error(`[API] Dietly Error: ${r.status}`)
  }

  return r.json();
}

export async function FetchRecipeAPI<T>(endpoint: string, query?: URLSearchParams) {
  const baseURL = "https://recipeapi.io/";
  const url = new URL(endpoint, baseURL);
  if (query) url.search = query.toString();

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${recipeApiKey}` },
  });

  if (!response.ok) {
    throw new Error(`[RecipeAPI] Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}