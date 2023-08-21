import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <View style={[styles.container]}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Link
        href="/toolbar"
        style={[styles.linkButton, { opacity: isPressed ? 0.6 : 1 }]}
        onPressIn={() => {
          setIsPressed(true);
        }}
      >
        Toolbar
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linkButton: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    fontWeight: '500',
    padding: 16,
  },
});
