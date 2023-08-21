import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function Index() {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <>
      <Link
        href="/toolbar"
        style={[styles.linkButton, { opacity: isPressed ? 0.6 : 1 }]}
        onPressIn={() => {
          setIsPressed(true);
        }}
      >
        Toolbar
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    fontWeight: '500',
    padding: 16,
  },
});
