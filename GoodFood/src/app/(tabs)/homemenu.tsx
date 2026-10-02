import React from "react";
import {
  SafeAreaView, /*inte krockar med hårdvara och mjukvara*/







  /*Borde vi ha en SafeAreaProvider? */
  ScrollView, /*möjliggör scroll*/
  Text, /*visa och styla text*/
  TextInput, /*inmatning*/
  TouchableOpacity, /*osynlig knapp som tonar*/
  View /*grupperar, strukturerar och stylar andra komponenter*/
} from "react-native";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { recipes } from "../../data/recipes";
const categories = ["All", "Breakfast", "Lunch & Dinner", "Light meal", "Snack"];


export default function HomeScreen() {                                      /*returnerar det som ska synas*/
  const [selectedCategory, setSelectedCategory] = React.useState("All");    /*vald knapp*/ /*utlösare, ändra det som 
  syns*/ /*skapa nytt minne, default är "All"*/
  const favorites = React.useContext(FavoritesContext); /*Hämtar favoritdata från context*/
   if (!favorites) {
    throw new Error("FavoritesContext missing");
  }/*Stoppar med ett felmeddelande om FavoritesContext saknas*/
  const { likedIds, setLikedIds } = favorites; /*Hämtar likedIds och setLikedIds från favorites*/
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
                <TouchableOpacity onPress={() => {if (likedIds.includes(recipe.id)) {
                  setLikedIds(likedIds.filter((id) => id !== recipe.id)); /*Toggle off hjärta*/
                } else {
                  setLikedIds([...likedIds, recipe.id]); /*Toggle on hjärta*/
                }}}>
                  <Text style={{ fontSize: 28, color: likedIds.includes(recipe.id) ? "red" : "gray" }}>♡</Text>
                </TouchableOpacity>
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


