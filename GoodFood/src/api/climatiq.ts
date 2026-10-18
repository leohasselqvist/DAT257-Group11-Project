
import { climatiqKey } from "./secret";

export async function testClimatiq() {
  const response = await fetch(
    "https://api.climatiq.io/mapping-agent/v1/estimate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${climatiqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "150 g burrata cheese",
        parameters: {
          weight: 150,
          weight_unit: "g",
        },
        explain_results: true,
      }),
    }
  );

  const data = await response.json();

  console.log("Status:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(
      `Climatiq request failed: ${response.status}`
    );
  }

  return data;
}
