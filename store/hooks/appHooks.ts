import { useCallback, useMemo } from "react";
import {
  resetSettings,
  setFirstLaunch,
  setNetworkStatus,
  updateSettings,
} from "../slices/appSlice";
import { useAppDispatch, useAppSelector } from "./baseHooks";

// 应用设置相关的选择器
export const useAppSettings = () => {
  const settings = useAppSelector((state) => {
    const appState = state.app as any;
    return (
      appState?.settings || {
        theme: "system" as const,
        language: "zh-CN",
        notifications: true,
        autoLogin: true,
      }
    );
  });

  return useMemo(() => settings, [settings]);
};

// 应用操作
export const useAppActions = () => {
  const dispatch = useAppDispatch();

  const updateSettingsAction = useCallback(
    (settings: any) => dispatch(updateSettings(settings)),
    [dispatch]
  );

  const setFirstLaunchAction = useCallback(
    (isFirst: boolean) => dispatch(setFirstLaunch(isFirst)),
    [dispatch]
  );

  const setNetworkStatusAction = useCallback(
    (status: "online" | "offline") => dispatch(setNetworkStatus(status)),
    [dispatch]
  );

  const resetSettingsAction = useCallback(
    () => dispatch(resetSettings()),
    [dispatch]
  );

  return useMemo(
    () => ({
      updateSettings: updateSettingsAction,
      setFirstLaunch: setFirstLaunchAction,
      setNetworkStatus: setNetworkStatusAction,
      resetSettings: resetSettingsAction,
    }),
    [
      updateSettingsAction,
      setFirstLaunchAction,
      setNetworkStatusAction,
      resetSettingsAction,
    ]
  );
};
