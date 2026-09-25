import React from "react";
import {
	SafeAreaView,             /*inte krockar med hårdvara och mjukvara*/
                            /*Borde vi ha en SafeAreaProvider? */
	ScrollView,               /*möjliggör scroll*/
	Text,                     /*visa och styla text*/
	TextInput,                /*inmatning*/
	TouchableOpacity,         /*osynlig knapp som tonar*/
	View                      /*grupperar, strukturerar och stylar andra komponenter*/
} from "react-native";

const categories = ["All", "Breakfast", "Lunch & Dinner", "Light meal", "Snack"];

const recipes = [
  {
    id: 1,
    title: "Creamy Garlic Chicken",
    category: "Lunch & Dinner",
    calories: 520,          /*skrivs över med beräkning nedan om felaktigt*/
    protein: 35,
    carbs: 20,
    fat: 30,
    time: "30 min",
  },
  {
    id: 2,
    title: "Avocado Egg Toast",
    category: "Breakfast",
    calories: 340,
    protein: 15,
    carbs: 25,
    fat: 10,
    time: "10 min",
  },
  {
    id: 3,
    title: "Mediterranean Bowl",
    category: "Lunch & Dinner",
    calories: 430,
    protein: 20,
    carbs: 50,
    fat: 15,
    time: "20 min",
  },


];

export default function HomeScreen() {                                      /*returnerar det som ska synas*/
  const [selectedCategory, setSelectedCategory] = React.useState("All");    /*vald knapp*/ /*utlösare, ändra det som syns*/ /*skapa nytt minne, default är "All"*/

  const filteredRecipes =                                                   /*filtreringsmöjlighet*/
    selectedCategory === "All"                                              /*== jämför värden, === jämför värden och datatyp*/
      ? recipes                                                             /* om sant */
      : recipes.filter((recipe) => recipe.category === selectedCategory );  /* gör detta */ /* gå igenom listan */ /*enskilt recept*/ /*om receptets kategori är sant*/

  return (
    <SafeAreaView> 
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text>Welcome, what recipes are you interested in?</Text>
        </View>

        <View>
          <TextInput placeholder="Search recipes, ingredients..." />
        </View>

        <ScrollView horizontal /*scrollar i sidled*/ showsHorizontalScrollIndicator={false} /*visar ej att det går att scrolla med en scrollbar*/> 
          {categories.map((category) => (
            <TouchableOpacity 
              key={category}                                                                /*knappens namn*/
              activeOpacity = {0.2}                                                         /*annorlunda för mindre knappar - tydlig blinkning*/
              onPress={() => setSelectedCategory(category)}                                 /*onPress säger vad som ska väljas*/
            >
              <Text>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View>
          <Text>Recommended recipes</Text>

          <TouchableOpacity onPress={() => setSelectedCategory("All")}>
            <Text>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id}                                               /*knappens namn*/
              activeOpacity={0.85}                                          /*default värde på opacity enligt standard på hemsida, jobbigt om stor knapp lyser mycket*/> 
              <View>
                <Text>{recipe.category}</Text>

                <Text numberOfLines={2}>{recipe.title}</Text>

                <Text>
                  {recipe.time} {"\n"}

                  {recipe.protein && recipe.carbs && recipe.fat
                    ? (recipe.protein * 4) + (recipe.carbs * 4) + (recipe.fat * 9) /*om detta är sant gör följande*/
                    : recipe.calories} kcal {"\n"}                                 {/*annars gör detta*/ /*ny rad*/}

                  {recipe.protein && `${recipe.protein}g protein`         /*om receptet har protein*/ /*om sant går vidare*/ /*skriv ut texten*/}
                  {recipe.carbs && ` | ${recipe.carbs}g carbs`}
                  {recipe.fat && ` | ${recipe.fat}g fat`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}


