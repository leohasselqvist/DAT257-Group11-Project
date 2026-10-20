import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { colors } from "../../constants/colors";
import { FavoritesProvider } from '../../contexts/FavoritesContext';
import { RecipeProvider } from '../../contexts/RecipeContext';

export default function TabLayout() {
  return (
    <FavoritesProvider> 
      <RecipeProvider>
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.main, headerShown: false }}>
      <Tabs.Screen
        name="homemenu"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
      name="favorites"
      options={{
        title: 'Favorites',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="heart" color={color} />,
      }}
      />
    </Tabs>
      </RecipeProvider>
    </FavoritesProvider>
  );
}
