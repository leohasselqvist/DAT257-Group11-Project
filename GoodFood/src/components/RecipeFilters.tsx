
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Cuisine,
  DietaryTags,
  Difficulty,
  MealType,
  type RecipeFilters as RecipeFiltersType,
} from "../api/types";

type Props = {
  filters: RecipeFiltersType;
  onUpdate: <K extends keyof RecipeFiltersType>(
    key: K,
    value: RecipeFiltersType[K] | undefined
  ) => void;
  onClear: () => void;
};

export default function RecipeFilters({
  filters,
  onUpdate,
  onClear,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Filters</Text>

      <EnumFilter
        title="Meal type"
        values={Object.values(MealType)}
        selected={filters.meal_type}
        onSelect={(value) => onUpdate("meal_type", value)}
      />

      <EnumFilter
        title="Difficulty"
        values={Object.values(Difficulty)}
        selected={filters.difficulty}
        onSelect={(value) => onUpdate("difficulty", value)}
      />

      <EnumFilter
        title="Cuisine"
        values={Object.values(Cuisine)}
        selected={filters.cuisine}
        onSelect={(value) => onUpdate("cuisine", value)}
      />

      <EnumFilter
        title="Dietary requirements"
        values={Object.values(DietaryTags)}
        selected={filters.dietary_tags}
        onSelect={(value) => onUpdate("dietary_tags", value)}
      />

      <Text style={styles.sectionHeading}>Preparation time (min)</Text>
      <NumberRange
        min={filters.prep_time_min}
        max={filters.prep_time_max}
        onMinChange={(value) => onUpdate("prep_time_min", value)}
        onMaxChange={(value) => onUpdate("prep_time_max", value)}
      />

      <Text style={styles.sectionHeading}>Cooking time (min)</Text>
      <NumberRange
        min={filters.cook_time_min}
        max={filters.cook_time_max}
        onMinChange={(value) => onUpdate("cook_time_min", value)}
        onMaxChange={(value) => onUpdate("cook_time_max", value)}
      />

      <Text style={styles.sectionHeading}>Calories per serving (kcal)</Text>
      <NumberRange
        min={filters.calories_per_serving_min}
        max={filters.calories_per_serving_max}
        onMinChange={(value) =>
          onUpdate("calories_per_serving_min", value)
        }
        onMaxChange={(value) =>
          onUpdate("calories_per_serving_max", value)
        }
      />

      <Text style={styles.sectionHeading}>Protein (g)</Text>
      <NumberRange
        min={filters.protein_min}
        max={filters.protein_max}
        onMinChange={(value) => onUpdate("protein_min", value)}
        onMaxChange={(value) => onUpdate("protein_max", value)}
      />

      <TouchableOpacity
        onPress={onClear}
        accessibilityRole="button"
        style={styles.clearButton}
      >
        <Text style={styles.clearText}>Clear filters</Text>
      </TouchableOpacity>
    </View>
  );
}

type EnumFilterProps<T extends string> = {
  title: string;
  values: T[];
  selected: T | undefined;
  onSelect: (value: T | undefined) => void;
};

function EnumFilter<T extends string>({
  title,
  values,
  selected,
  onSelect,
}: EnumFilterProps<T>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{title}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.buttonGap}>
          <FilterButton
            label="All"
            selected={selected === undefined}
            onPress={() => onSelect(undefined)}
          />

          {values.map((value) => (
            <FilterButton
              key={value}
              label={formatLabel(value)}
              selected={selected === value}
              onPress={() =>
                onSelect(selected === value ? undefined : value)
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function formatLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

type FilterButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function FilterButton({
  label,
  selected,
  onPress,
}: FilterButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.categoryButton,
        selected && styles.categoryButtonSelected,
      ]}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

type NumberRangeProps = {
  min: number | undefined;
  max: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
};

function NumberRange({
  min,
  max,
  onMinChange,
  onMaxChange,
}: NumberRangeProps) {
  function parseNumber(
    text: string,
    callback: (value: number | undefined) => void
  ) {
    if (text.trim() === "") {
      callback(undefined);
      return;
    }

    const value = Number(text);

    if (Number.isFinite(value) && value >= 0) {
      callback(value);
    }
  }

  return (
    <View style={styles.rangeRow}>
      <TextInput
        style={styles.numberInput}
        placeholder="Min"
        keyboardType="numeric"
        value={min === undefined ? "" : String(min)}
        onChangeText={(text) => parseNumber(text, onMinChange)}
      />

      <Text style={styles.rangeSeparator}>to</Text>

      <TextInput
        style={styles.numberInput}
        placeholder="Max"
        keyboardType="numeric"
        value={max === undefined ? "" : String(max)}
        onChangeText={(text) => parseNumber(text, onMaxChange)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
  },
  section: {
    gap: 4,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonGap: {
    padding: 6,
    gap: 6,
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  categoryButtonSelected: {
    backgroundColor: "#E8F2FF",
    borderColor: "#8DB9FF",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  numberInput: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#DADDD8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  rangeSeparator: {
    color: "#666666",
  },
  clearButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  clearText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
