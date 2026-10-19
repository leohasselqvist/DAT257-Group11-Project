import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";

import type { RecipeIngredient } from "../api/types";
import { estimateRecipeCO2 } from "../app/helpers/estimateRecipeCO2";

import type { RecipeCO2Estimate } from "../app/helpers/estimateRecipeCO2";
import { CO2Modal } from "./CO2Modal";

// Inside CO2Button:


interface CO2ButtonProps {
  ingredients: RecipeIngredient[];
}

export function CO2Button({ ingredients }: CO2ButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState<RecipeCO2Estimate | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePress() {
  setLoading(true);

  try {
    const estimate = await estimateRecipeCO2(ingredients);
    setResult(estimate);
    setModalVisible(true);
  } catch (error) {
    Alert.alert(
      "CO₂ estimation failed",
      error instanceof Error ? error.message : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <>
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading}
      style={{
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#E5F0E8",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text>Estimate CO₂ footprint</Text>
      )}
    </TouchableOpacity>

    <CO2Modal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      result={result}
    />
  </>
  );
}