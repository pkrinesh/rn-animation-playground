import clsx, { ClassValue } from 'clsx';
import { Stack } from 'expo-router';
import React, { ComponentProps } from 'react';
import { View } from 'react-native';
import { ScreenProps } from 'react-native-screens';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import { cn } from '~/utils';

export type ScaffoldProps = ComponentProps<typeof Stack.Screen> &
  Pick<ViewProps, 'style' | 'children'> & {
    classTw?: ClassValue;
  };

export function Scaffold({
  children,
  classTw,
  style,
  ...screenProps
}: ScaffoldProps) {
  return (
    <View className={clsx('flex-1', classTw)} style={style}>
      <Stack.Screen {...screenProps} />
      {children}
    </View>
  );
}
