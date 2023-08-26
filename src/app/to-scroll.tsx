import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  SharedValue,
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import { Scaffold } from '~/components/scaffold';

const ITEM_COUNT = 10;
const ITEM_SIZE = 100;
const ITEM_MARGIN = 10;

/**
 * Attribute
 * This is corrected and modified version of to-scroll example from reanimated docs.
 * https://docs.swmansion.com/react-native-reanimated/docs/scroll/scrollTo#example
 */
export default function ToScroll() {
  const aref = useAnimatedRef<ScrollView>();
  const scroll = useSharedValue(0);

  useDerivedValue(() => {
    scrollTo(aref, 0, scroll.value * (ITEM_SIZE + 2 * ITEM_MARGIN), true);
  });

  const items = Array.from(Array(ITEM_COUNT).keys());

  return (
    <Scaffold options={{ title: 'To Scroll' }} classTw="bg-orange-400">
      <Incrementor increment={1} scroll={scroll} />
      <View
        style={{
          width: '100%',
          height: (ITEM_SIZE + 2 * ITEM_MARGIN) * 2,
        }}
      >
        <ScrollView
          ref={aref}
          className="bg-orange-400"
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((_, i) => (
            <View
              key={i}
              style={{
                backgroundColor: 'white',
                aspectRatio: 1,
                width: ITEM_SIZE,
                margin: ITEM_MARGIN,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'center' }}>{i}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Incrementor increment={-1} scroll={scroll} />
    </Scaffold>
  );
}

function Incrementor({
  increment,
  scroll,
}: {
  increment: number;
  scroll: SharedValue<number>;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        className="p-4 bg-orange-200 rounded-full"
        onPress={() => {
          scroll.value =
            scroll.value + increment >= 0
              ? scroll.value + increment
              : ITEM_COUNT - 1 + increment;

          if (increment > 0 && scroll.value >= ITEM_COUNT - 2) scroll.value = 0;
        }}
      >
        <Icon
          name={increment > 0 ? 'arrow-down' : 'arrow-up'}
          size={28}
          color={'rgb(194, 65, 12)'}
        />
      </TouchableOpacity>
    </View>
  );
}
