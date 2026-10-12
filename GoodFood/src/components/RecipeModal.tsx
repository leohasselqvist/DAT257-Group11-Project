
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { Recipe } from "../api/types";

type RecipeModalProps = {
  recipe: Recipe;
  visible: boolean;
  onClose: () => void;
};

export default function RecipeModal({
  recipe,
  visible,
  onClose,
}: RecipeModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.modalView}
          onPress={(event) => event.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{recipe.name}</Text>

            <Text style={styles.description}>
              {recipe.description}
            </Text>

            <Text style={styles.sectionTitle}>Ingredients</Text>

            {recipe.ingredients.map((ingredient, index) => (
              <Text
                key={`${ingredient.id}-${index}`}
                style={styles.recipeText}
              >
                • {ingredient.name} — {ingredient.quantity}{" "}
                {ingredient.unit}
                {ingredient.optional ? " (optional)" : ""}
              </Text>
            ))}

            <Text style={styles.sectionTitle}>Instructions</Text>

            {recipe.instructions.map((step, index) => (
              <Text
                key={`${index}-${step}`}
                style={styles.recipeText}
              >
                {index + 1}. {step}
              </Text>
            ))}

            <Text style={styles.sectionTitle}>
              Nutrition per serving
            </Text>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Calories</Text>
              <Text style={styles.macroValue}>
                {recipe.calories_per_serving} kcal
              </Text>
            </View>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>
                {recipe.protein} g
              </Text>
            </View>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Servings</Text>
              <Text style={styles.macroValue}>
                {recipe.servings}
              </Text>
            </View>

            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Difficulty</Text>
              <Text style={styles.macroValue}>
                {recipe.difficulty}
              </Text>
            </View>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: "85%",
    maxHeight: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#252824",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#3a3f39",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#252824",
    marginTop: 14,
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 15,
    color: "#3a3f39",
    lineHeight: 22,
    marginBottom: 6,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECEDE8",
  },
  macroLabel: {
    fontSize: 15,
    color: "#3a3f39",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#252824",
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#2196F3",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
