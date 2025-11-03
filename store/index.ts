import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { persistReducer, persistStore } from "redux-persist";
import authSlice from "./slices/authSlice";
import dictsSlice from "./slices/dictsSlice";
import toastSlice from "./slices/toastSlice";

// 跨平台存储配置
const getStorage = () => {
  if (Platform.OS === "web") {
    // Web 端使用 localStorage
    return require("redux-persist/lib/storage").default;
  } else {
    // 移动端使用 AsyncStorage
    return AsyncStorage;
  }
};

// 持久化配置
const persistConfig = {
  key: "root",
  storage: getStorage(),
  whitelist: [], // 只持久化这些 reducer
};

// 认证持久化配置
const authPersistConfig = {
  key: "auth",
  storage: getStorage(),
  whitelist: ["isAuthenticated", "userInfo"], // 只持久化这些字段，不持久化 token
};

// 字典持久化配置
const dictsPersistConfig = {
  key: "dicts",
  storage: getStorage(),
  whitelist: ["dicts", "lastUpdated"], // 只持久化这些字段
};

// 根 reducer
// 注意：不需要持久化的 reducer（如 toast）直接使用原始 reducer，不需要 persistReducer 包装
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  dicts: persistReducer(dictsPersistConfig, dictsSlice),
  toast: toastSlice, // 不需要持久化，直接使用原始 reducer
});

// 持久化根 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
      // 放宽不可变性检查的阈值，避免性能警告
      // 如果状态很大且警告仍然频繁出现，可以设置为 false 完全禁用
      immutableCheck: {
        warnAfter: 128, // 提高到 128ms，默认是 32ms
        // 如果警告仍然频繁，可以取消下面的注释以完全禁用
        ignore: true,
      },
    }),
});

// 创建 persistor
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
