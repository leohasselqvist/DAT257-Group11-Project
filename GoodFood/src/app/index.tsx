import { Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
	return (
		<View style={styles.container}>
			<Text>Wow I have changed the texty</Text>
			<Link href="/recipe_menu" style={styles.button}>Go to About screen</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
    fontSize: 20,
    textDecorationLine: "underline",
	},
});
