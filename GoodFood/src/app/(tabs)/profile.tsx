import { View, Button, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useState } from 'react'; /*tillstånd*/
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
/*import * as api from '../../databaseAPI/API';*/
import { useRouter } from 'expo-router';
/*import { Allergy, Cuisine, DietaryTags } from '@/api/types';*/


/*kontrollera att användarinfon inte är tom*/
function checkUserInfo(
  firstName: string,              /*tar emot förnamn som text*/
  lastName: string,               /*efternamn*/
  email: string,                  /*email*/
  password: string){              /*password*/
    if (                      /*kontrollerar om något är tomt*/
      !firstName.trim() ||        /*om förnamnet (utan mellanslag är tomt)*/
      !lastName.trim() ||         /*eller om efternamnet är tomt*/
      !email.trim() ||            /*email tom*/
      !password.trim()){          /*lösenord tom*/
    return false; /*inteOKkod, saknas info*/
  }
    if (!email.includes('@') || !email.includes('.')) {
      return false;}
  return true; /*kodenserOKut, har info*/
}

/*skapar huvudkomponenten för profilskärmen*/
const TextInputExample = () => {
  const [firstName, setFirstName] = useState('');             /*skriv förnamn*/
  const [lastName, setLastName] = useState('');               /*skriv efternamn*/
  const [email, setEmail] = useState('');                     /*väljer email*/
  const [password, setPassword] = useState('password123');    /*väljer lösenord*/
  const [isEditing, setIsEditing] = useState(false);          /*väljer om man vill redigera eller inte*/ 
  const [message, setMessage] = useState('');                 /*meddelande som visas när man sparar informationen*/
  const [updatedAt, setUpdatedAt] = useState('');             /*visar när informationen senast uppdateradesn*/
  const [allergies, setAllergies] = useState('');   /*skapar state för allergier med en tom startsträng*/
  const [avatar, setAvatar] = useState('');                   /*skapar state för avatar-emojin med en standard-emoji*/
  const router = useRouter();
  const [username, setUsername] = useState(''); /*hårdkodad användarnamn för testning, kan ändras till dynamiskt värde senare*/
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<DietaryTags[]>([]);

/*function toggleAllergy() {
  setAllergiesOpen((previous) => !previous);
}*/

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>

          <View style={styles.container}>

            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold', 
                marginBottom: 10,
                marginTop: 20,
                color: 'black'
              }}  
            >
            
              Profile Information
            </Text>

            <Text style = {{fontSize: 40}}>{avatar}</Text>          
            {isEditing && (
              <View style = {{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, width: 280,}}>
                {['🍎', '🍐', '🍊', '🍋', '🍌', '🍉',
                  '🍇', '🍓', '🫐', '🍒', '🥭', '🍍',
                  '🥝', '🥑', '🥕', '🥦', '🍏', '🍑',
                  '🍈', '🥥', '🍅', '🫒', '🌽', '🥒',
                  '🌶️', '🫑', '🍆', '🧄', '🧅', '🥔',
                  '🍠', '🥗', '🥬', '🫚', '🍄', '🫘',
                  '🥜', '🌰', '🫛', '🍋‍🟩', '🍄‍🟫', '🥚'].map((emoji) => (
                  <Pressable
                    key = {emoji}
                    onPress= {() => setAvatar(emoji)} /*ropar på setAvatar*/
                  >
                    <Text style = {{ fontSize: 10}}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/*Textfält för förnamn*/}
            <TextInput
              style={styles.input}            /*stilen för textfältet*/
              placeholder="First Name"        /*grå text som syns när fältet är tomt*/
              placeholderTextColor='grey'     /*färgen på placeholder-texten*/
              value = {firstName}             /*värdet som kopplas till förnamnstate*/
              onChangeText={setFirstName}     /*uppdaterar state när användaren skriver*/
              editable={isEditing}            /*styrs av om vi är i redigeringsläge eller inte*/
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor='grey'
              value = {lastName}
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
              placeholderTextColor='grey'
              value = {email}
              onChangeText={setEmail}
              autoCapitalize='none'           /*stänger av automatiska stora bokstäver*/
              editable={isEditing}
            />

            <TextInput
              style = {styles.input}
              placeholder="Allergies, ..."
              placeholderTextColor='grey'
              value = {allergies}
              onChangeText={setAllergies}
              editable={isEditing}
            />

          </View>
          
          
          {/* Knapp som byter text beroende på om vi redigerar eller inte */}
          <Button
              title = {isEditing ? 'SAVE' : 'CHANGE INFORMATION'} /*text på knappen*/
              onPress={() => {                                    /*när man klickar*/
                if (isEditing) {                                  /*kör valideringsfunktionen och kollar om något saknas*/
                  
                  if (!checkUserInfo(firstName, lastName, email, password)) { /*skapar en tom array för att samla upp namnen på fält som saknas*/
                    const missingFields = [];

                    if (!firstName.trim()) missingFields.push('first name') /*om förnamnet är tomt, lägg till 'first name' i listan*/
                    if (!lastName.trim()) missingFields.push ('last name')  /*! kollar om det är tomt eller inte*/
                    if (!email.trim()) missingFields.push ('email')         /*trim() gör så att man inte har mellanslag*/
                    if (!password.trim()) missingFields.push ('passwords')
                    

                    /*sätter ett felmeddelande baserat på vilka fält som glömdes bort*/
                    return setMessage(
                      missingFields.length > 0
                        ? `Invalid user information. Missing: ${missingFields.join(', ')}` /*om sant, tar alla ord i listan och klistrar ihop dem till en enda vanlig text med ett kommatecken och ett mellanslag mellan varje ord*/
                        : 'Invalid user information. Check your eneterd information.'      /*om falskt*/
                      
                    );
                  }


                  ///schema.updateUserInfo({username: 'testuser', first_name: firstName, last_name: lastName, email: email, password_hash: password});
                  
                  
                  
                  setUpdatedAt(new Date().toLocaleString('sv-SE'));     /*visar när informationen senast uppdaterades*/
                  setMessage('Your information has been saved.');       /*bekräftelsemeddelande*/
                  
                  if (Platform.OS === 'web') {                          /*kollar om appen körs i en webbläsare eller en mobilapp*/
                    window.alert('Your information has been saved.');   /*visar en webbläsar-alert om det är webb*/
                  } else {
                    Alert.alert('Your information has been saved.');    /*visar en mobilalert om det är iOS/Android*/
                  }
                } else {                                                /*om vi inte redigerade innan, så förbereder vi användaren på att ändra*/
                  setMessage('You can now change your information.');
                }                                                       /*växlar tillståndet för isEditing*/
                setIsEditing(!isEditing);
              }}
              color = "#0857f4"                                       /*knappens färg*/

          />

          <Button
              title = {'LOG OUT'} /*text på knappen*/
              onPress={async () => {

                setFirstName(''); /*nollställer alla fält när man loggar ut*/
                setLastName('');
                setUsername('');
                setEmail('');
                setPassword('');
                setAllergies('');
                setAvatar('');
                setMessage('You have been logged out.'); /*meddelande som visas när man loggar ut*/
                setUpdatedAt(''); /*nollställer updatedAt när man loggar ut*/
                setIsEditing(false); /*stänger redigeringsläge när man loggar ut*/
                router.replace('/'); /*navigerar tillbaka till startsidan efter utloggning*/
              }}  
          />

          <Text>{message}</Text>
          
          {/*visar tidsstämpeln endast om updatedAt inte är en tom sträng*/}
          {updatedAt !== '' && ( /*!== inte lika med, && logisk och/och om*/
            <Text> Your information was last updated: {updatedAt}</Text>
          )}

          </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

                                                                      /*Skapar ett stil-objekt med StyleSheet för att formatera komponenterna*/
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F8F8F5",
  },

input: {
  height: 40, 
  margin: 12, 
  borderWidth: 1,
  padding: 10,
  borderRadius: 10, 
  backgroundColor: 'white',
  color: 'black',
  borderColor: 'black',
}

});

export default TextInputExample;                                      /*exporterar komponenten så den kan användas i andra delar av appen*/