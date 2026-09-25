import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { dietlyApiKey } from "../api/secret";

export default function ApiTesting() {
	interface foodProps {
		id: number;
		name: string;
		brand: string;
		barcode: string;
		calories_kcal: number;
		carbs_g: number;
		fat: number;
		protein_g: number;
		suger_g: number;
		image_url: string;
	}

	const [searchResult, setSearchResult] = useState<foodProps>();
	const query: string = "clam";
	const results: number = 1;
	const search = async () => {
		const url = new URL("https://api.getdietly.com/search");
		url.search = new URLSearchParams({
			q: query,
			limit: results.toString(),
		}).toString();

		const r = await fetch(url, {
			headers: { Authorization: `Bearer ${dietlyApiKey}` },
		});
		if (!r.ok) {
			throw new Error(`[API] Dietly Error: ${r.status}`);
		}
		const result = await r.json();
		return result;
	};

	useEffect(() => {
		const s = search();
		setSearchResult(s?.T);
	}, []);

	return (
		<View style={styles.container}>
			<Text>{searchResult?.brand}</Text>
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
