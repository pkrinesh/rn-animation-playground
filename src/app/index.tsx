import { Link, LinkComponent, LinkProps, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type RouteConfig = {
  name: string;
  href: LinkProps<string>['href'];
};

const routes: RouteConfig[] = [
  {
    name: 'Toolbar',
    href: '/toolbar',
  },
];

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <View style={[styles.container]}>
      <Stack.Screen options={{ title: 'Home' }} />
      {routes.map(({ name, href }) => (
        <Link
          key={href}
          href={href}
          style={[styles.linkButton, { opacity: isPressed ? 0.6 : 1 }]}
          onPressIn={() => {
            setIsPressed(true);
          }}
        >
          {name}
        </Link>
      ))}
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
