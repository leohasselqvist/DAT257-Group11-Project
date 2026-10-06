import React from "react";
import {
  ScrollView,               /*möjliggör scroll*/
  Text,                     /*visa och styla text*/
  TextInput,                /*inmatning*/
  TouchableOpacity,         /*osynlig knapp som tonar*/
  View,                      /*grupperar, strukturerar och stylar andra komponenter*/
  StyleSheet,
  Image,
} from "react-native";
import { recipes } from "../../data/recipes";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecipeCard } from "../../components/RecipeCard";


const categories = ["All", "Breakfast", "Lunch & Dinner", "Light meal", "Snack"];

function RecipeMenu({ items }: { items : typeof recipes }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <RecipeCard key={item.id} recipe={item} />
      ))}
    </View>
  );
}

export default function HomeScreen() {                                      /*returnerar det som ska synas*/
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    (selectedCategory === "All" || recipe.category === selectedCategory) &&
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  
  return (
    <SafeAreaView>
      <Image
        source={require('../../../assets/images/Goodfood_logo_v1.png')}
        style={{
          width: 200,
          height: 80,
          marginVertical: 16,
        }}
        resizeMode="contain"
        />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Welcome, what recipes are you interested in?</Text>
        </View>

        <View>
          <TextInput
          style={styles.searchBar}
          placeholder="Search recipes..."
          placeholderTextColor="#9A9D96"
          value={searchQuery}
          onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal /*scrollar i sidled*/ showsHorizontalScrollIndicator={false} /*visar ej att det går att scrolla med en scrollbar*/> 
          <View style={styles.buttonGap}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}  /*knappens namn*/
                activeOpacity = {0.2} /*annorlunda för mindre knappar - tydlig blinkning*/
                onPress={() => {  /*onPress säger vad som ska väljas*/
                  setSelectedCategory(category)
                  if (category === "All") {
                    setSearchQuery("");
                  }
                }}
              >
                <Text style={styles.categoryButton}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView>
          <Text style={styles.recommended}>Recommended recipes</Text>
          {/*
          <TouchableOpacity onPress={() => setSelectedCategory("All")}>
            <Text>See all</Text>
          </TouchableOpacity>
          */}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          <RecipeMenu items={filteredRecipes}/>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F5",
  },
  grid: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  title: {
    paddingHorizontal: 6,
    fontSize: 24,
    fontWeight: "900",
    color: "#252824",
  },
  recommended: {
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#252824",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  buttonGap: {
    padding: 6,
    gap: 6,
    flexDirection: "row",
  },
  searchBar: {
    marginHorizontal: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEDE8",
    fontSize: 15,
    color: "#252824",
  },
});