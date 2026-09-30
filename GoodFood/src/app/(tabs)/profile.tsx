import { View, Button, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [firstName, setFirstName] = useState('Alice'); /*skriv förnamn*/
  const [lastName, setLastName] = useState('Smith'); /*skriv efternamn*/
  const [email, setEmail] = useState('alice@example.com'); /*väljer email*/
  const [password, setPassword] = useState('password123'); /*väljer lösenord*/
  const [isEditing, setIsEditing] = useState(false); /*väljer om man vill redigera eller inte*/ 

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>

          <View style={styles.container}>

            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold', 
                marginBottom: 10,
                marginTop: 20,
                color: '#0e87f0f6',

              }}
            >
            
              Profile Information
            </Text>

            <TextInput
              style={styles.input}
              value = {firstName}
              onChangeText={setFirstName}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              value = {lastName}
              onChangeText={setLastName}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              value = {email}
              onChangeText={setEmail}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              value = {password}
              onChangeText={setPassword}
              editable={isEditing}
            />

          </View>

          <Button
            title ={isEditing ? 'Spara' : 'Ändra information'}
            onPress={() => setIsEditing(!isEditing)}
          />

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cae1f7',
  },

input: {
  height: 40, 
  margin: 12, 
  borderWidth: 1,
  padding: 10,
  borderRadius: 10, 
  backgroundColor: '#0e87f0f6',
  color: 'white',
  borderColor: 'white',
}

});

export default TextInputExample;