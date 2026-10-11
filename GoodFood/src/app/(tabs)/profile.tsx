import { View, Button, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [firstName, setFirstName] = useState('Alice'); /*skriv förnamn*/
  const [lastName, setLastName] = useState('Smith'); /*skriv efternamn*/
  const [email, setEmail] = useState('alice@example.com'); /*väljer email*/
  const [password, setPassword] = useState('password123'); /*väljer lösenord*/
  const [isEditing, setIsEditing] = useState(false); /*väljer om man vill redigera eller inte*/ 
  const [message, setMessage] = useState(''); /*meddelande som visas när man sparar informationen*/
  const [updatedAt, setUpdatedAt] = useState(''); /*visar när informationen senast uppdaterades*/

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
                color: '#f9f7f4e2',

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
              title = {isEditing ? 'SAVE' : 'CHANGE INFORMATION'}
              onPress={() => {
                if (isEditing) {
                  setUpdatedAt(new Date().toLocaleString('sv-SE')); /*visar när informationen senast uppdaterades*/
                  setMessage('Your information has been saved.');
                  
                  if (Platform.OS === 'web') {
                    window.alert('Your information has been saved.');
                  } else {
                    Alert.alert('Your information has been saved.');
                  }
                } else {
                  setMessage('You can now change your information.');
                }
                setIsEditing(!isEditing);
              }}
              color = '#e6aa72f6'

          />

          <Text>{message}</Text>

          {updatedAt !== '' && (
            <Text> Your information was last updated: {updatedAt}</Text>
          )}
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
    backgroundColor: '#ea821af6',
  },

input: {
  height: 40, 
  margin: 12, 
  borderWidth: 1,
  padding: 10,
  borderRadius: 10, 
  backgroundColor: '#e6aa72f6',
  color: 'white',
  borderColor: 'white',
}

});

export default TextInputExample;