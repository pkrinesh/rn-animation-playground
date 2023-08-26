import clsx from 'clsx';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ColorValue,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Scaffold } from '~/components/scaffold';

const COLOR_PALETTE = [
  ['rgb(195, 107, 88)', 'rgb(216, 160, 164)', 'rgb(209, 178, 195)'],
  ['rgb(202, 106, 123)', 'rgb(224, 156, 192)', 'rgb(212, 171, 215)'],
  ['rgb(187, 122, 248)', 'rgb(212, 172, 250)', 'rgb(216, 191, 251)'],
  ['rgb(118, 134, 247)', 'rgb(157, 183, 259)', 'rgb(168, 198, 250)'],
  ['rgb(103, 130, 169)', 'rgb(182, 208, 237)', 'rgb(195, 218, 246)'],
  ['rgb(0, 0, 0)', 'rgb(64, 68, 88)', 'rgb(122, 128, 159)'],
];

const PALETTE_WIDTH = 60;
const PALETTE_HEIGHT = 250;

type ColorsPaletteProps = {
  colors: ColorValue[];
  index: number;
  gestureDegree: SharedValue<number>;
  activeColor: ColorValue;
  onActiveColor: (color: ColorValue) => void;
};

function ColorPalette({
  index,
  colors,
  activeColor,
  onActiveColor,
  gestureDegree,
}: ColorsPaletteProps) {
  const anchorPressHandler = () => {
    gestureDegree.value = gestureDegree.value === 0 ? 90 : 0;
  };

  const paletteStyle: StyleProp<ViewStyle> = useAnimatedStyle(() => {
    const angle =
      COLOR_PALETTE.length - 1 > 0
        ? (gestureDegree.value / (COLOR_PALETTE.length - 1)) * index
        : 0;

    return {
      transform: [
        { translateY: (PALETTE_HEIGHT - 50) / 2 },
        { rotate: withSpring(`${angle}deg`, { mass: 0.4 }) },
        { translateY: -(PALETTE_HEIGHT - 50) / 2 },
      ],
    };
  }, []);

  return (
    <Animated.View
      className="absolute bg-white p-1 rounded-[20px]"
      style={[{ width: PALETTE_WIDTH, height: PALETTE_HEIGHT }, paletteStyle]}
    >
      {colors.map((color, i) => (
        <Pressable
          key={i}
          className={clsx(
            'flex-1 w-full rounded-lg',
            i === 0 && 'rounded-t-[20px]',
          )}
          style={[
            // i === 0 && styles.colorTop,
            {
              backgroundColor: color,
              marginBottom: i < colors.length - 1 ? 4 : 0,
            },
          ]}
          onPress={() => onActiveColor(color)}
        />
      ))}
      <Pressable
        className="h-[50] w-full justify-center items-center"
        onPress={anchorPressHandler}
      >
        <View
          className="w-6 h-6 rounded-full border justify-center items-center"
          style={{ borderColor: activeColor }}
        >
          <View
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: activeColor }}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ColorSwatch() {
  const [activeColor, setActiveColor] = useState<ColorValue>('rgb(64, 68, 88)');
  const gestureDegree = useSharedValue(0);

  const calculateDegree = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => {
    'worklet';

    let degree =
      Math.atan2(PALETTE_HEIGHT - e.y, e.x - PALETTE_WIDTH / 2) *
      (180 / Math.PI);
    degree < -90 && (degree = degree + 360);

    return 90 - degree;
  };

  const dragGesture = Gesture.Pan()
    .onStart((e) => {
      gestureDegree.value = calculateDegree(e);
    })
    .onUpdate((e) => {
      gestureDegree.value = calculateDegree(e);
    })
    .onEnd(() => {
      gestureDegree.value = gestureDegree.value > 90 ? 90 : 0;
    });

  return (
    <Scaffold
      options={{
        title: 'Color Card',
        headerTransparent: true,
        headerTitleStyle: { color: 'rgb(243 244 246)' },
        headerTintColor: 'rgb(243 244 246)',
      }}
      classTw="justify-end"
      style={{ backgroundColor: activeColor }}
    >
      <StatusBar backgroundColor={activeColor as string} style="light" />
      <GestureDetector gesture={dragGesture}>
        <View
          className="m-10"
          style={{ width: PALETTE_WIDTH, height: PALETTE_HEIGHT }}
        >
          {COLOR_PALETTE.map((colors, index) => (
            <ColorPalette
              colors={colors}
              index={index}
              key={index}
              activeColor={activeColor}
              onActiveColor={setActiveColor}
              gestureDegree={gestureDegree}
            />
          ))}
        </View>
      </GestureDetector>
    </Scaffold>
  );
}
