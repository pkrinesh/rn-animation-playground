import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
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

type ButtonProps = {
  item: (typeof BUTTONS_LIST)[0];
  index: number;
  offset: SharedValue<number>;
  activeY: SharedValue<number>;
};

const ITEM_HEIGHT = 50 + 16; // 50 = icon height, 16 = top + bottom padding
const TOOLBAR_HEIGHT = ITEM_HEIGHT * 7 + 16; // 50 = button height, 7 = total visible items, 16 = main toolbar's top + bottom padding
const TOTAL_HEIGHT = ITEM_HEIGHT * BUTTONS_LIST.length + 16; // == 1600, BUTTONS_LIST.length === 24, 16 == top + bottom padding

/**
 * Button-component
 */
function Button({ item, index, offset, activeY }: ButtonProps) {
  const itemEndPos = (index + 1) * ITEM_HEIGHT + 8;
  const itemStartPos = itemEndPos - ITEM_HEIGHT;

  const isItemActive = useDerivedValue(() => {
    const pressedPoint = activeY.value + offset.value;
    const isValid = pressedPoint >= itemStartPos && pressedPoint < itemEndPos;

    return activeY.value !== 0 && isValid;
  }, [activeY]);

  const viewStyle = useAnimatedStyle(() => {
    // Max user can scroll (max scroll offset)
    // To activate Rubber banding effect after overscroll on bottom for iOS
    const endScrollLimit = TOTAL_HEIGHT - TOOLBAR_HEIGHT;

    const isItemOutOfView =
      itemEndPos < offset.value || itemStartPos > offset.value + TOOLBAR_HEIGHT;

    return {
      width: withSpring(isItemActive.value ? 140 : 50, { damping: 15 }),
      // For Scroll Rubber banding effect
      top:
        offset.value < 0
          ? (index + 1) * Math.abs(offset.value / 10)
          : offset.value > endScrollLimit
          ? -(BUTTONS_LIST.length - index + 1) *
            Math.abs((offset.value - endScrollLimit) / 10)
          : 0,
      // translate & scaling when icon is (in)active
      transform: [
        {
          translateX: withTiming(isItemActive.value ? 55 : 0, {
            duration: 250,
            easing: Easing.out(Easing.quad),
          }),
        },
        // Item scaling, 1.2 = Active, 0.4 = out of view, 1 = default
        {
          scale: withTiming(
            isItemActive.value ? 1.2 : isItemOutOfView ? 0.4 : 1,
            { duration: 250 },
          ),
        },
      ],
    };
  });

  // Scale down the view that contains the icon,
  // so that container view's scaling when it's active, have no effect on the icon
  const innerViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(isItemActive.value ? 0.8 : 1, { duration: 250 }) },
      ],
    };
  });

  const titleOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isItemActive.value ? 1 : 0, { duration: 250 }),
    };
  });

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        { backgroundColor: item.color },
        viewStyle,
      ]}
    >
      <Animated.View style={innerViewStyle}>
        <Icon name={item.icon} color="white" size={24} />
      </Animated.View>
      <Animated.Text style={[styles.buttonTitle, titleOpacity]}>
        {item.title}
      </Animated.Text>
    </Animated.View>
  );
}

/**
 * Toolbar-component
 */
export default function Toolbar() {
  // Active press point within TOOLBAR_HEIGHT, 0 when not active.
  const activeY = useSharedValue(0);
  // Contains list scroll offset from top. In (-) when user scroll past the top on iOS (important to activate Rubber banding effect).
  const scrollOffset = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((e) => {
      activeY.value = e.y;
    })
    .onUpdate((e) => {
      activeY.value = e.y;
    })
    .onEnd(() => {
      activeY.value = 0;
    });

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollOffset.value = e.contentOffset.y;
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Toolbar' }} />
        <View style={styles.toolbarView} />
        <GestureDetector gesture={dragGesture}>
          <Animated.FlatList
            data={BUTTONS_LIST}
            keyExtractor={(item, index) => `${item.title}_${index}`}
            style={styles.buttonListView}
            contentContainerStyle={{ padding: 8 }}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <Button offset={scrollOffset} {...{ item, index, activeY }} />
            )}
          />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  toolbarView: {
    width: 50 + 16,
    height: TOOLBAR_HEIGHT,
    backgroundColor: 'white',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderRadius: 12,
    marginHorizontal: 24,
    marginVertical: 40,
    elevation: 32,
  },
  buttonListView: {
    position: 'absolute',
    height: TOOLBAR_HEIGHT,
    width: '100%',
    marginHorizontal: 24,
    marginVertical: 40,
    // Note:- This elevation here is just to avoid the scroll not working issue on Android. It won't show unless 'backgroundColor' is added.
    elevation: 32,
  },
  buttonContainer: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 8,
    padding: 13,
  },
  buttonTitle: {
    marginLeft: 12,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
