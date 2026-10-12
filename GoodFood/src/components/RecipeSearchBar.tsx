
import { StyleSheet, TextInput, View } from "react-native";

type RecipeSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RecipeSearchBar({
  value,
  onChange,
}: RecipeSearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search recipes..."
        placeholderTextColor="#9A9D96"
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Search recipes"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    fontSize: 15,
    color: "#252824",
  },
});
