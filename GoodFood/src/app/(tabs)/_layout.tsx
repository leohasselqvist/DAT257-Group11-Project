import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
      name="recipes"
      options={{
        title: 'Recipes',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
      />
      <Tabs.Screen
      name="favorites"
      options={{
        title: 'Favorites',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
      />
    </Tabs>
  );
}
