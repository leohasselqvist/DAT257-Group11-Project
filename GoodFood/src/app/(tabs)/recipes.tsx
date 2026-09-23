import { View, Text, StyleSheet } from 'react-native';

export default function Recipes() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Recepies]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
