import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { FavoritesProvider } from '../../contexts/FavoritesContext';
export default function TabLayout() {
  return (
    /*Ger alla flikar som ligger innanför favoritstates*/
    <FavoritesProvider> 
  
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
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
    </FavoritesProvider>
  );
}
