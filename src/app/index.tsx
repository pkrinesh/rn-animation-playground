import clsx from 'clsx';
import { Link, LinkProps, Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Scaffold } from '~/components/scaffold';

type RouteConfig = {
  name: string;
  href: LinkProps<string>['href'];
};

const routes: RouteConfig[] = [
  {
    name: 'Toolbar',
    href: '/toolbar',
  },
  {
    name: 'To Scroll',
    href: '/to-scroll',
  },
  {
    name: 'Color Card Spread',
    href: '/color-card-spread',
  },
];

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Scaffold options={{ title: 'Home' }}>
      {routes.map(({ name, href }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            'p-4 text-lg font-medium border-b border-b-gray-300',
            isPressed ? 'opacity-60' : 'opacity-100',
          )}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          {name}
        </Link>
      ))}
    </Scaffold>
  );
}
