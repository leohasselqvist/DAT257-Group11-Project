import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'index',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
      name="recipes"
      options={{
        title: 'recipes ',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
      />
    </Tabs>
  );
}
