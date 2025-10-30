import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// 自定义主题色调
export const customColors = {
  primary: "#4a9aff",
  primaryContainer: "#e3f2fd",
  secondary: "#4a9aff",
  secondaryContainer: "#e8f4fd",
  tertiary: "#4a9aff",
  tertiaryContainer: "#f0f8ff",
  surface: "#ffffff",
  surfaceVariant: "#f8f9fa",
  background: "#ffffff",
  error: "#ff6b6b",
  errorContainer: "#ffe6e6",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#1a365d",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#1a365d",
  onTertiary: "#ffffff",
  onTertiaryContainer: "#1a365d",
  onSurface: "#1a1a1a",
  onSurfaceVariant: "#666666",
  onBackground: "#1a1a1a",
  onError: "#ffffff",
  onErrorContainer: "#d32f2f",
  outline: "#e0e0e0",
  outlineVariant: "#f0f0f0",
  shadow: "#000000",
  scrim: "#000000",
  inverseSurface: "#2d2d2d",
  inverseOnSurface: "#ffffff",
  inversePrimary: "#4a9aff",
  elevation: {
    level0: "transparent",
    level1: "#ffffff",
    level2: "#ffffff",
    level3: "#ffffff",
    level4: "#ffffff",
    level5: "#ffffff",
  },
};

// 简约设计字体配置
const customTypography = {
  displayLarge: {
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  displayMedium: {
    fontFamily: "System",
    fontSize: 28,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  displaySmall: {
    fontFamily: "System",
    fontSize: 24,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineLarge: {
    fontFamily: "System",
    fontSize: 22,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  headlineMedium: {
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 26,
  },
  headlineSmall: {
    fontFamily: "System",
    fontSize: 18,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  titleLarge: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "500" as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  titleMedium: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  titleSmall: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  bodyLarge: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "400" as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "400" as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "400" as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500" as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500" as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
};

// 简约设计圆角配置
const customRoundness = 12;

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffff",
    foreground: "#ebebeb",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#000000",
    foreground: "#292929",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

// 创建自定义主题
export const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
    background: Colors.light.background,
    foreground: Colors.light.foreground,
  },
  typography: customTypography,
  roundness: customRoundness,
};

export const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customColors,
    background: Colors.dark.background,
    foreground: Colors.dark.foreground,
    surface: "#1a1a1a",
    onSurface: "#ffffff",
    onSurfaceVariant: "#cccccc",
    elevation: {
      level0: "transparent",
      level1: "#1a1a1a",
      level2: "#1e1e1e",
      level3: "#222222",
      level4: "#252525",
      level5: "#292929",
    },
  },
  typography: customTypography,
  roundness: customRoundness,
};

export default customLightTheme;
