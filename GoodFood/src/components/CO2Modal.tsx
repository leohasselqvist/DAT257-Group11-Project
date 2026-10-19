
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import type { RecipeCO2Estimate } from "../app/helpers/estimateRecipeCO2";

interface CO2ModalProps {
  visible: boolean;
  onClose: () => void;
  result: RecipeCO2Estimate | null;
}

export function CO2Modal({ visible, onClose, result }: CO2ModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#0006",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 10,
            width: "100%",
            maxWidth: 400,
            maxHeight: "80%",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#4CAF50",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              Estimated CO₂ Footprint
            </Text>
          </View>

          {result && (
            <>
              <Text style={{ fontSize: 18 }}>
                Total: {result.totalCO2eKg.toFixed(3)} kg CO₂e (for matched ingredients)
              </Text>

              <Text style={{ marginTop: 6 }}>
                Coverage: {result.coveragePercentage.toFixed(0)}%
                {" "}({result.estimatedCount}/{result.totalCount} ingredients)
              </Text>

              <Text style={{ fontWeight: "bold", marginTop: 16, marginBottom: 4 }}>
                Ingredients
              </Text>

              <ScrollView>
                {result.ingredients.map((ingredient) => (
                  <View
                    key={ingredient.ingredientId}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text>
                        {ingredient.quantity} {ingredient.unit}{" "}
                        {ingredient.ingredientName}
                      </Text>

                      {ingredient.matchedFactorName && (
                        <Text style={{ fontSize: 12, color: "#666" }}>
                          Matched: {ingredient.matchedFactorName}
                        </Text>
                      )}

                      {ingredient.error && (
                        <Text style={{ fontSize: 12, color: "#B45309" }}>
                          {ingredient.error}
                        </Text>
                      )}
                    </View>

                    <Text>
                      {ingredient.co2eKg !== null
                        ? `${ingredient.co2eKg.toFixed(4)} kg CO₂ estimated`
                        : "N/A"}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          <TouchableOpacity
            onPress={onClose}
            style={{ alignSelf: "flex-end", marginTop: 16 }}
          >
            <Text style={{ color: "#388E3C", fontWeight: "600" }}>
              Close ✕
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
