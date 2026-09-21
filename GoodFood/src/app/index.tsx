import { Text, View, StyleSheet } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<Text>Wow I have changed the text</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
