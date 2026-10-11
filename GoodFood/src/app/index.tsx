import { useRouter } from 'expo-router';
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as api from '../databaseAPI/API';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    async function handlePress() {
        if (username.trim() === "") {
            setError("Please enter a valid username");
            return;
        }
        try {
            const id = await api.getUserId(username.trim());
            if (id !== -1) {
                // TODO: store id for the favourites calls
                router.replace('/homemenu');
            } else {
                setError("User does not exist click signup to make an account");
            }
        } catch {
            setError("Can't reach the server");
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.form}>
                    <Text style={styles.header}>Sign in to GoodFood</Text>
                    <View style={styles.row}>
                        <View>
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor={"rgba(0, 0, 0, 0.6)"}
                                style={[styles.input, error !== "" && styles.inputError]}
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    setError("");
                                }}
                            />
                            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
                        </View>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handlePress}
                        >
                            <Text>Login</Text>
                        </Pressable>
                    </View>
                </View>
                <Pressable style={styles.linkWrapper} onPress={() => router.push('/signup')}>
                    <Text>No account? <Text style={styles.link}>Sign up</Text></Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: "bold",
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        padding: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        height: 40,
        backgroundColor: "lightgrey",
    },
    buttonPressed: {
        backgroundColor: "lightblue",
    },
    form: {
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 50,
        paddingHorizontal: 75,
        gap: 10,
        backgroundColor: "#6e6e6e3c",
        borderRadius: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        textAlign: "center",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        height: 40,
        width: 200,
        backgroundColor: "white",
    },
    inputError: {
        borderColor: "red",
    },
    errorText: {
        position: "absolute",
        top: 44,
        color: "red",
        fontSize: 12,
        width: 200,
        textAlign: "center",
    },
    linkWrapper: {
        alignSelf: "flex-start",
        marginTop: 8,
    },
    link: {
        color: "#1a56db",
        textDecorationLine: "underline",
    },
});