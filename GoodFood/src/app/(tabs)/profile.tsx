import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { clearCurrentUserId, getCurrentUserId } from '../../contexts/UserContext';
import * as api from '../../databaseAPI/API';
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
  const [username, setUsername] = useState('')
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [allergies, setAllergies] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  function showMessage(text:string) {
    setMessage(text);
    setModalVisible(true);
  }

  // Load the saved profile when the page opens.
  useEffect(() => {
    async function loadProfile() {
      const userId = getCurrentUserId();

      if (userId == null) {
        setMessage('You need to log in first.');
        return;
      }

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

function handleLogout(){
                setLogoutModalVisible(false);
                clearCurrentUserId();
                setFirstName(''); /*nollställer alla fält när man loggar ut*/
                setLastName('');
                setUsername('');
                setEmail('');
                setAllergies('');
                setAvatar('');
                setMessage('You have been logged out.'); /*meddelande som visas när man loggar ut*/
                setUpdatedAt(''); /*nollställer updatedAt när man loggar ut*/
                setIsEditing(false); /*stänger redigeringsläge när man loggar ut*/
                router.replace('/'); /*navigerar tillbaka till startsidan efter utloggning*/
              }
              
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
              placeholder="Username"
              placeholderTextColor='grey'
              value = {username}
              onChangeText={setUsername}
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
  

          <View style={styles.buttonContainer}>
            <Button
              title={isEditing ? 'SAVE' : 'CHANGE INFORMATION'}
              color="#f48208"
              onPress={async () => {
                if (!isEditing) {
                  showMessage('You can now change your information.');
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

                  showMessage(
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
                    setModalVisible(true);
                    return;
                  }

                  setUpdatedAt(new Date().toLocaleString('sv-SE'));
                  setMessage('OK.');
                  setIsEditing(false);
                  setModalVisible(true);


                  if (Platform.OS === 'web') {
                    window.alert('OK.');
                  } else {
                    Alert.alert('OK.');
                  }                
                
                } catch (error) {
                  setMessage('Could not save profile.');
                  setModalVisible(true);
                  console.error(error);
                }
              }}
          />

          
          <Button
              title = {'LOG OUT'} /*text på knappen*/
              onPress={async () => setLogoutModalVisible(true)}
              />
          </View>


          <Text>{message}</Text>
          <Modal
            animationType = "fade"
            transparent = {true}
            visible = {modalVisible}
            onRequestClose={() => {
              setModalVisible(false); 
            }}
          >
            <View style = {styles.modalCenteredView}> 
              <View style = {styles.modalView}>
                <Text style = {styles.modalText}>{message}</Text>
                <Button
                  title='OK'
                  onPress={() => setModalVisible(false)}
                  color = "orange"
              />
              </View>
            </View>
          </Modal>  

          <Modal
            animationType = "fade"
            transparent = {true}
            visible = {logoutModalVisible}
            onRequestClose={() => 
              setLogoutModalVisible(false)}
          >
            <View style = {styles.modalCenteredView}> 
              <View style = {styles.modalView}>
                <Text style = {styles.modalText}>{"Do you want to log out?"}</Text>
                <Button
                  title='cancel'
                  onPress={() => setLogoutModalVisible(false)}
              />
              <Button
              title="Yes, logout"
              onPress={handleLogout}
              />
              </View>
            </View>
          </Modal> 
          
          {/*visar tidsstämpeln endast om updatedAt inte är en tom sträng*/}
          {updatedAt !== '' && ( /*!== inte lika med, && logisk och/och om*/
            <Text> Your information was last updated: {updatedAt}</Text>
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
    flex: 1, 
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  modalCenteredView: {
    flex : 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center'
  },

  modalText: {
    marginBottom: 20, 
    textAlign: 'center', 
    fontSize: 16, 
    color: 'black',
  }
});

export default TextInputExample;
