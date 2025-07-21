# rn_remote_config_feature_flag

A React Native feature flag utility using Firebase Remote Config and Redux Toolkit.

## 📦 Installation

### From NPM (if published)
```bash
yarn add rn_remote_config_feature_flag
```

### From GitHub
```bash
yarn add rn_remote_config_feature_flag@https://github.com/nguyenhoangvannha/rn_remote_config_feature_flag.git#v0.0.1
```

### Local development
```bash
yarn add link:../packages/rn_remote_config_feature_flag
```

---

## 🛠️ Build

```bash
yarn build
```

---

## 🚀 Usage

### 1. Setup Feature Config

```ts
import { FeatureConfig, FeatureKeysEnum } from 'rn_remote_config_feature_flag';
import { useAppDispatch } from 'your-app-redux-hooks';

FeatureConfig.createInstance(
  [
    { key: FeatureKeysEnum.ImproveChat, boolValue: false },
    // Add more flags here
  ],
  {
    fetchExpiration: 120000, // Optional: cache duration in ms
  }
);

FeatureConfig.instance.init(useAppDispatch());
```

---

### 2. Use Feature Flag in Component

```tsx
import React from 'react';
import { Text } from 'react-native';
import { useFeatureFlag, FeatureKeysEnum } from 'rn_remote_config_feature_flag';

const ChatFeatureBanner = () => {
  const chatFeatureEnabled = useFeatureFlag(FeatureKeysEnum.ImproveChat);

  if (chatFeatureEnabled) {
    return <Text>New Chat Experience Enabled!</Text>;
  }

  return <Text>New Chat Experience Not Enabled!</Text>;
};

export default ChatFeatureBanner;
```

---

### 3. Add Reducer

In your root Redux store setup:

```ts
import { featureConfigReducer } from 'rn_remote_config_feature_flag';

const store = configureStore({
  reducer: {
    featureConfig: featureConfigReducer,
    // other reducers...
  },
});
```

---

## ✅ Features

- Firebase Remote Config integration
- Async fetching and initialization
- Feature flag boolean hooks (`useFeatureFlag`)
- Type-safe keys with `FeatureKeysEnum`
- Redux state-based for reactivity and testing

---

## 📄 License

MIT
