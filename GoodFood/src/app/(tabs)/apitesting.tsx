import { useEffect } from "react";
import { Text, View } from "react-native";
import { FetchDietly } from "../api/apiClient";

export default function ApiTesting() {
  useEffect(() => {
    async function testPopular() {
      try {
        const foods = await FetchDietly<unknown>(
          "foods/popular?limit=10&offset=0"
        );
        console.log("GET /popular:/foods", JSON.stringify(foods, null, 2));
      } catch (error) {
        console.error("Popular foods request failed:", error);
      }
    }

    void testPopular();
  }, []);

  return (
    <View>
      <Text>Check the Expo/Metro console for the popular foods response.</Text>
    </View>
  );
}