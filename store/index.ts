import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { persistReducer, persistStore } from "redux-persist";
import appSlice from "./slices/appSlice";
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

// 应用设置持久化配置
const appPersistConfig = {
  key: "app",
  storage: getStorage(),
  whitelist: ["settings", "isFirstLaunch"], // 只持久化这些字段
};

// 字典持久化配置
const dictsPersistConfig = {
  key: "dicts",
  storage: getStorage(),
  whitelist: ["dicts", "lastUpdated"], // 只持久化这些字段
};

// Toast 持久化配置（不持久化，因为 Toast 是临时状态）
const toastPersistConfig = {
  key: "toast",
  storage: getStorage(),
  whitelist: [], // 不持久化 Toast 状态
};

// 根 reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  app: persistReducer(appPersistConfig, appSlice),
  dicts: persistReducer(dictsPersistConfig, dictsSlice),
  toast: persistReducer(toastPersistConfig, toastSlice),
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
    }),
});

// 创建 persistor
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
