import { climatiqKey } from "./secret";
import type {
    EmissionEstimateResponse,
    EmissionFactorSearchResponse,
} from "./types";

const BASE_URL = "https://api.climatiq.io";
// const DATA_VERSION = "^38";

export async function estimateIngredientCO2(
  name: string,
  weightKg: number
) {
  const params = new URLSearchParams({
    query: name,
    // data_version: DATA_VERSION,
    access_type: "public",
    results_per_page: "10",
  });

  const searchResponse = await fetch(
    `${BASE_URL}/data/v1/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${climatiqKey}`,
      },
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search failed: ${searchResponse.status}`);
  }

  const searchData =
    (await searchResponse.json()) as EmissionFactorSearchResponse;

  const factor = searchData.results?.find(
    (f) => f.access_type === "public" && f.unit_type === "Weight"
  );

  if (!factor) {
    return {
      co2eKg: null,
      error: "No public weight-based factor found",
    };
  }

  const estimateResponse = await fetch(
    `${BASE_URL}/data/v1/estimate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${climatiqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emission_factor: {
          activity_id: factor.activity_id,
        //   data_version: DATA_VERSION,
        },
        parameters: {
          weight: weightKg,
          weight_unit: "kg",
        },
      }),
    }
  );

  if (!estimateResponse.ok) {
    throw new Error(`Estimate failed: ${estimateResponse.status}`);
  }

  const estimateData =
    (await estimateResponse.json()) as EmissionEstimateResponse;

  return {
    co2eKg: estimateData.co2e,
    matchedFactorName: factor.name,
    activityId: factor.activity_id,
  };
}