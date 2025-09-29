import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 主题类型
export type ThemeMode = "light" | "dark" | "system";

// 应用设置接口
export interface AppSettings {
  theme: ThemeMode;
  language: string;
  notifications: boolean;
  autoLogin: boolean;
}

// 应用状态接口
interface AppState {
  settings: AppSettings;
  isFirstLaunch: boolean;
  networkStatus: "online" | "offline";
}

// 默认设置
const defaultSettings: AppSettings = {
  theme: "system",
  language: "zh-CN",
  notifications: true,
  autoLogin: true,
};

// 初始状态
const initialState: AppState = {
  settings: defaultSettings,
  isFirstLaunch: true,
  networkStatus: "online",
};

// 应用 slice
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // 更新设置
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    // 设置首次启动
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    // 设置网络状态
    setNetworkStatus: (state, action: PayloadAction<"online" | "offline">) => {
      state.networkStatus = action.payload;
    },
    // 重置设置
    resetSettings: (state) => {
      state.settings = defaultSettings;
      state.isFirstLaunch = false;
    },
  },
});

// 导出 actions
export const {
  updateSettings,
  setFirstLaunch,
  setNetworkStatus,
  resetSettings,
} = appSlice.actions;

// 导出 reducer
export default appSlice.reducer;
