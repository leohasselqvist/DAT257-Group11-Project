import { Header } from "expo-router/build/react-navigation";
import { dietlyApiKey } from "./secret" // IF YOU GET AN ERROR HERE DM LEO

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