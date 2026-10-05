import React, {useState} from "react";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";

export default function Login() {
    const [username, setUsername] = useState("");
    function handlePress(){
        if (username.trim() === ""){
            console.log("invalid input");
        }else {
            console.log("valid input");
        }
    }
    return (
        
        <View style={styles.container}>
            <Text style={styles.header}>Login into your account</Text>
            <View style={styles.form}>

                <TextInput 
                    placeholder="Username"
                    placeholderTextColor={"rgba(0, 0, 0, 0.6)"}
                    style = {styles.input}
                    value={username}
                    onChangeText={setUsername}
                    />
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
        
    );
    
    
}
const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 200,
        alignSelf: "center",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        padding:10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        height: 40,
        backgroundColor: "lightgrey",
    }, 
    buttonPressed: {
        backgroundColor: "lightblue"
    },
    form: {
        alignItems : "center", 
        justifyContent: "center",
        padding: 10,
        flexDirection: "row",
        gap: 10,
        
    },
    input: {
        textAlign: "center",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5 ,
        height: 40,
        
    },
});
