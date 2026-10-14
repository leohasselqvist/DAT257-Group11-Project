import { rapidApiKey } from "./secret" // IF YOU GET AN ERROR HERE DM LEO

// Api Client

// The lowest level of the API layers, sending base requests without 

export async function FetchDietly<T>(endpoint: string, params?: RequestInit) {
  const dietlyBaseURL = 'https://api.getdietly.com/';
  const r = await fetch(
    `${dietlyBaseURL}${endpoint}`, // Build the basic request, eg. getdietly.com/search
    {...params,  // Add the paramaters, "..." just means to spread the data so we don't create a dict inside of a dict.
      headers: { 

        Authorization: `Bearer `, // IF YOU GET AN ERROR HERE DM LEO
        ...params?.headers // Since we overwrite the headers above, we readd them here.
      }});
  
  if (!r.ok) {
    throw new Error(`[API] Dietly Error: ${r.status}`)
  }

  return r.json();
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