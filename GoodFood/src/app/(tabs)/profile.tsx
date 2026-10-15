import {View,Button,Text,StyleSheet,TextInput,ScrollView,Pressable,Alert,Platform,} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as api from '../../databaseAPI/API';
import { getCurrentUserId } from '../../contexts/UserContext';

function checkUserInfo(
  firstName: string,
  lastName: string,
  email: string
): boolean {
  if (!firstName.trim() || !lastName.trim() || !email.trim()) {
    return false;
  }

  if (!email.includes('@') || !email.includes('.')) {
    return false;
  }

  return true;
}

const TextInputExample = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [allergies, setAllergies] = useState('');
  const [avatar, setAvatar] = useState('');

  // Load the saved profile when the page opens.
  useEffect(() => {
    async function loadProfile() {
      const userId = getCurrentUserId();

      try {
        const user = await api.getUserById(userId!);

        setFirstName(user.first_name ?? '');
        setLastName(user.last_name ?? '');
        setEmail(user.email ?? '');
      } catch (error) {
        setMessage('Could not load profile.');
        console.error(error);
      }
    }

    loadProfile();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.heading}>
              Profile Information
            </Text>

            <Text style={{ fontSize: 40 }}>{avatar}</Text>

            {isEditing && (
              <View style={styles.emojiContainer}>
                {[
                  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉',
                  '🍇', '🍓', '🫐', '🍒', '🥭', '🍍',
                  '🥝', '🥑', '🥕', '🥦', '🍏', '🍑',
                  '🍈', '🥥', '🍅', '🫒', '🌽', '🥒',
                  '🌶️', '🫑', '🍆', '🧄', '🧅', '🥔',
                  '🍠', '🥗', '🥬', '🫚', '🍄', '🫘',
                  '🥜', '🌰', '🫛', '🍋‍🟩', '🍄‍🟫', '🥚',
                ].map((emoji) => (
                  <Pressable
                    key={emoji}
                    onPress={() => setAvatar(emoji)}
                  >
                    <Text style={{ fontSize: 20 }}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="grey"
              value={firstName}
              onChangeText={setFirstName}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="grey"
              value={lastName}
              onChangeText={setLastName}
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={isEditing}
            />

            <TextInput
              style={styles.input}
              placeholder="Allergies (not saved yet)"
              placeholderTextColor="grey"
              value={allergies}
              onChangeText={setAllergies}
              editable={isEditing}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={isEditing ? 'SAVE' : 'CHANGE INFORMATION'}
              color="#f48208"
              onPress={async () => {
                if (!isEditing) {
                  setMessage('You can now change your information.');
                  setIsEditing(true);
                  return;
                }

                if (!checkUserInfo(firstName, lastName, email)) {
                  const missingFields = [];

                  if (!firstName.trim()) {
                    missingFields.push('first name');
                  }
                  if (!lastName.trim()) {
                    missingFields.push('last name');
                  }
                  if (!email.trim()) {
                    missingFields.push('email');
                  }

                  setMessage(
                    missingFields.length > 0
                      ? `Invalid user information. Missing: ${missingFields.join(', ')}`
                      : 'Invalid user information. Check your entered information.'
                  );
                  return;
                }

                const userId = getCurrentUserId();

                try {
                  const success = await api.updateUserProfile(
                    userId!,
                    firstName,
                    lastName,
                    email
                  );

                  if (!success) {
                    setMessage('Could not save profile.');
                    return;
                  }

                  setUpdatedAt(new Date().toLocaleString('sv-SE'));
                  setMessage('Your information has been saved.');
                  setIsEditing(false);

                  if (Platform.OS === 'web') {
                    window.alert('Your information has been saved.');
                  } else {
                    Alert.alert('Your information has been saved.');
                  }
                } catch (error) {
                  setMessage('Could not save profile.');
                  console.error(error);
                }
              }}
            />
          </View>

          <View style={styles.messageContainer}>
            <Text>{message}</Text>

            {updatedAt !== '' && (
              <Text>
                Your information was last updated: {updatedAt}
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F5',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: 'black',
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    width: 212,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 280,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'black',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  messageContainer: {
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
});

export default TextInputExample;
