import { Text, View, StyleSheet } from "react-native";

export default function Favorites() {
    return (
        <View style={styles.container}>
            <Text>Tab [Home|Recipes]</Text>
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
