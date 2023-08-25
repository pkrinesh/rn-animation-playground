import { ClassValue } from 'clsx';
import { Stack } from 'expo-router';
import React, { ComponentProps } from 'react';
import { View } from 'react-native';
import { ScreenProps } from 'react-native-screens';
import { cn } from '~/utils';

export type ScaffoldProps = {
  children: React.ReactNode;
  tw: ClassValue[];
  options: ComponentProps<typeof Stack.Screen>;
};

export function Scaffold({ children, tw, options }: ScaffoldProps) {
  return (
    <View className={cn('flex-1', tw)}>
      <Stack.Screen {...options} />
      {children}
    </View>
  );
}
