import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function ColorCardSpread() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Color Card' }} />
      <Text>This is color-card-spread component</Text>
    </View>
  );
}
