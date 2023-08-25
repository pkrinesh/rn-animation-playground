import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Attribution:
 * This is inspired from Aashu-Dubey's youtube video for learning purpose only.
 * I have made some changes for better readability and understanding.
 *
 * for original code: https://github.com/Aashu-Dubey/youtube/blob/0543549531d7668f533fc749cd9ee155ebc3f74b/rn_youtube/src/animatedToolbar/ToolbarReanimated.tsx
 * for video: https://www.youtube.com/watch?v=27pTWrcEDC4
 */
const COLORS = [
  'hsl(243, 77%, 73%)',
  'hsl(107, 40%, 73%)',
  'hsl(220, 80%, 64%)',
  'hsl(36, 72%, 61%)',
  'hsl(0, 67%, 70%)',
  'hsl(271, 61%, 72%)',
  'hsl(45, 81%, 63%)',
];

const BUTTONS_LIST = [
  { title: 'Draw', icon: 'gesture', color: COLORS[0] },
  { title: 'Lasso', icon: 'voicemail', color: COLORS[1] },
  { title: 'Comment', icon: 'add-comment', color: COLORS[2] },
  { title: 'Enhance', icon: 'auto-fix-high', color: COLORS[3] },
  { title: 'Picker', icon: 'colorize', color: COLORS[4] },
  { title: 'Rotate', icon: '360', color: COLORS[5] },
  { title: 'Dial', icon: 'dialpad', color: COLORS[6] },
  { title: 'Graphic', icon: 'pie-chart-outlined', color: COLORS[0] },

  { title: 'Draw', icon: 'gesture', color: COLORS[1] },
  { title: 'Lasso', icon: 'voicemail', color: COLORS[2] },
  { title: 'Comment', icon: 'add-comment', color: COLORS[3] },
  { title: 'Enhance', icon: 'auto-fix-high', color: COLORS[4] },
  { title: 'Picker', icon: 'colorize', color: COLORS[5] },
  { title: 'Rotate', icon: '360', color: COLORS[6] },
  { title: 'Dial', icon: 'dialpad', color: COLORS[0] },
  { title: 'Graphic', icon: 'pie-chart-outlined', color: COLORS[1] },

  { title: 'Draw', icon: 'gesture', color: COLORS[2] },
  { title: 'Lasso', icon: 'voicemail', color: COLORS[3] },
  { title: 'Comment', icon: 'add-comment', color: COLORS[4] },
  { title: 'Enhance', icon: 'auto-fix-high', color: COLORS[5] },
  { title: 'Picker', icon: 'colorize', color: COLORS[6] },
  { title: 'Rotate', icon: '360', color: COLORS[0] },
  { title: 'Dial', icon: 'dialpad', color: COLORS[1] },
  { title: 'Graphic', icon: 'pie-chart-outlined', color: COLORS[2] },
];

const ITEM_HEIGHT = 50 + 16; // 50 = icon height, 16 = top + bottom padding
const TOOLBAR_HEIGHT = ITEM_HEIGHT * 7 + 16; // 50 = button height, 7 = total visible items, 16 = main toolbar's top + bottom padding
const TOTAL_HEIGHT = ITEM_HEIGHT * BUTTONS_LIST.length + 16; // == 1600, BUTTONS_LIST.length === 24, 16 == top + bottom padding

type IconButtonProps = {
  index: number;
  item: (typeof BUTTONS_LIST)[0];
  offset: SharedValue<number>;
  activeY: SharedValue<number>;
};

function IconButton({ index, item, offset, activeY }: IconButtonProps) {
  const itemEndPos = (index + 1) * ITEM_HEIGHT + 8;
  const itemStartPos = itemEndPos - ITEM_HEIGHT;
  const endScrollLimit = TOTAL_HEIGHT - TOOLBAR_HEIGHT; // for rubber-band effect on iso (bottom)

  const isItemInTheView = useDerivedValue(() => {
    return (
      itemStartPos < TOOLBAR_HEIGHT + offset.value && itemEndPos > offset.value
    );
  }, [offset]);

  const isItemActive = useDerivedValue(() => {
    const activeYPos = activeY.value;
    const offsetY = offset.value;

    const isValid =
      activeYPos >= itemStartPos - offsetY && activeYPos < itemEndPos - offsetY;

    return activeYPos !== 0 && isValid;
  }, [activeY]);

  const rubberBandEffectOnIosStyle = useAnimatedStyle(() => ({
    top:
      offset.value < 0
        ? (index + 1) * Math.abs(offset.value / 10)
        : offset.value > endScrollLimit
        ? -(BUTTONS_LIST.length - index + 1) *
          Math.abs((offset.value - endScrollLimit) / 10)
        : 0,
  }));

  const scrollAnimatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(isItemInTheView.value ? 1 : 0.4, { duration: 250 }),
      },
    ],
  }));

  const activeIconContainerStyle = useAnimatedStyle(() => ({
    width: withSpring(isItemActive.value ? 140 : 50, { damping: 15 }),
    transform: [
      {
        translateX: withTiming(isItemActive.value ? 55 : 0, {
          duration: 250,
          easing: Easing.out(Easing.quad),
        }),
      },
      {
        scale: withTiming(isItemActive.value ? 1.2 : 1, { duration: 250 }),
      },
    ],
  }));

  const activeIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(isItemActive.value ? 0.8 : 1, { duration: 250 }) },
      ],
    };
  });

  const activeTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isItemActive.value ? 1 : 0, { duration: 250 }),
    };
  });

  return (
    <Animated.View
      className="w-[50] h-[50] rounded-xl my-2 p-[13] flex-row items-center"
      style={[
        { backgroundColor: item.color },
        scrollAnimatedIconStyle,
        activeIconContainerStyle,
        rubberBandEffectOnIosStyle,
      ]}
    >
      <Animated.View style={[activeIconStyle]}>
        <Icon name={item.icon} color="white" size={24} />
      </Animated.View>
      <Animated.View className="ml-3" style={[activeTitleStyle]}>
        <Text className="text-white text-base font-bold">{item.title}</Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function ToolBar() {
  const scrollOffset = useSharedValue(0);
  const activeY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollOffset.value = e.contentOffset.y;
  });

  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((e) => (activeY.value = e.y))
    .onUpdate((e) => (activeY.value = e.y))
    .onEnd(() => (activeY.value = 0));

  return (
    <View className="flex-1 justify-center">
      <Stack.Screen options={{ title: 'Toolbar' }} />
      <View
        style={[{ width: 50 + 16, height: TOOLBAR_HEIGHT }, styles.shadow]}
        className="bg-white rounded-xl mx-6 my-10"
      />
      <GestureDetector gesture={dragGesture}>
        <Animated.FlatList
          className="absolute w-full mx-6 my-10"
          style={{ height: TOOLBAR_HEIGHT, elevation: 32 }}
          data={BUTTONS_LIST}
          keyExtractor={(item, index) => `${item.title}_${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 8 }}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          renderItem={({ item, index }) => (
            <IconButton
              item={item}
              index={index}
              offset={scrollOffset}
              activeY={activeY}
            />
          )}
        />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 32,
  },
});
