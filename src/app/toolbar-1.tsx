import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
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

const ITEM_HEIGHT = 50 + 16; // 50 = icon height, 16 = top + bottom padding
const TOOLBAR_HEIGHT = ITEM_HEIGHT * 7 + 16; // 50 = button height, 7 = total visible items, 16 = main toolbar's top + bottom padding
const TOTAL_HEIGHT = ITEM_HEIGHT * BUTTONS_LIST.length + 16; // == 1600, BUTTONS_LIST.length === 24, 16 == top + bottom padding

type IconButtonProps = {
  index: number;
  item: (typeof BUTTONS_LIST)[0];
  offset: SharedValue<number>;
};

function IconButton({ index, item, offset }: IconButtonProps) {
  const itemEndPos = (index + 1) * ITEM_HEIGHT + 8;
  const itemStartPos = itemEndPos - ITEM_HEIGHT;

  const scrollAnimatedIconStyle = useAnimatedStyle(() => {
    const isItemOutOfView =
      itemEndPos < offset.value || itemStartPos > offset.value + TOOLBAR_HEIGHT;

    return {
      transform: [
        { scale: withTiming(isItemOutOfView ? 0.4 : 1, { duration: 250 }) },
      ],
    };
  });

  return (
    <Animated.View
      className="w-[50] h-[50] rounded-xl my-2 p-[13] flex-row items-center"
      style={[{ backgroundColor: item.color }, scrollAnimatedIconStyle]}
    >
      <View className="">
        <Icon name={item.icon} color="white" size={24} />
      </View>
      <View className="ml-3 opacity-0">
        <Text className="text-white text-base font-bold">{item.title}</Text>
      </View>
    </Animated.View>
  );
}

export default function ToolBar() {
  const scrollOffset = useSharedValue(0);
  const listRef = useAnimatedRef<Animated.FlatList<(typeof BUTTONS_LIST)[0]>>();

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollOffset.value = e.contentOffset.y;
  });

  return (
    <View className="flex-1 justify-center">
      <Stack.Screen options={{ title: 'Toolbar' }} />
      <View
        style={[{ width: 50 + 16, height: TOOLBAR_HEIGHT }, styles.shadow]}
        className="bg-white rounded-xl mx-6 my-10"
      />
      <Animated.FlatList
        ref={listRef}
        className="absolute w-full mx-6 my-10"
        style={{ height: TOOLBAR_HEIGHT, elevation: 32 }}
        data={BUTTONS_LIST}
        keyExtractor={(item, index) => `${item.title}_${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        renderItem={({ item, index }) => (
          <IconButton item={item} index={index} offset={scrollOffset} />
        )}
      />
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
