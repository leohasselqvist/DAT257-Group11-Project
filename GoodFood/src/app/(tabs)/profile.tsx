import { View, Button, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
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
                color: '#e0d0b8e2',

              }}
            >
            
              Profile Information
            </Text>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              value = {firstName}
              onChangeText={setFirstName}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value = {lastName}
              onChangeText={setLastName}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value = {email}
              onChangeText={setEmail}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value = {password}
              onChangeText={setPassword}
              editable={isEditing}
            />

          </View>

          <Button
            title ={isEditing ? 'Spara' : 'Ändra information'}
            onPress={() => setIsEditing(!isEditing)}
            color = '#e4a03a6a'

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
    backgroundColor: '#e48c3af6',
  },

input: {
  height: 40, 
  margin: 12, 
  borderWidth: 1,
  padding: 10,
  borderRadius: 10, 
  backgroundColor: '#e48c3af6',
  color: 'white',
  borderColor: 'white',
}

});

export default TextInputExample;