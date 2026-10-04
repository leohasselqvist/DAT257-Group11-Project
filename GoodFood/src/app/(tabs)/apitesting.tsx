import { Text, View, StyleSheet } from "react-native";
import { useState } from "react"
import { Popular, Search } from "../../api/dietly"; // Step 1 Import the functions you want

export default function ApiTesting() {
	/*interface foodProps {
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
	*/

	const { foods } = Popular(); // step 2, create a prop using the function

	// Step 3, use conditionals to show the prop, eg. {PROP HERE ? (WHAT TO DO WHEN IT IS THERE)) : (WHAT TO DO WHEN IT IS LOADING OR FAILED)}

	return (
		<View>
			<Text>
				{foods ? (foods[0].name) : ("Something went wrong.")}
			</Text>
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
