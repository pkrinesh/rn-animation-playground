import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
