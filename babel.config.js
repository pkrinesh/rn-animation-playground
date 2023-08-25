module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
            assets: './assets',
          },
        },
      ],
      'expo-router/babel',
      'react-native-reanimated/plugin',
      'nativewind/babel',
    ],
  };
};
