import { useCallback, useMemo } from "react";
import type { ToastItem } from "../slices/toastSlice";
import {
  clearAllToasts,
  removeToast,
  showError,
  showInfo,
  showSuccess,
  showToast,
  showWarning,
} from "../slices/toastSlice";
import { useAppDispatch, useAppSelector } from "./baseHooks";

// Toast 选择器 hooks
export const useToast = () => {
  const toasts = useAppSelector((state: any) => state.toast.toasts);
  const isVisible = useAppSelector((state: any) => state.toast.isVisible);

  return useMemo(
    () => ({
      toasts,
      isVisible,
    }),
    [toasts, isVisible]
  );
};

// Toast 操作 hooks
export const useToastActions = () => {
  const dispatch = useAppDispatch();

  const showToastAction = useCallback(
    (toast: Omit<ToastItem, "id">) => dispatch(showToast(toast)),
    [dispatch]
  );

  const removeToastAction = useCallback(
    (id: string) => dispatch(removeToast(id)),
    [dispatch]
  );

  const clearAllToastsAction = useCallback(
    () => dispatch(clearAllToasts()),
    [dispatch]
  );

  const showSuccessAction = useCallback(
    (title: string, message?: string, duration?: number) =>
      dispatch(showSuccess({ title, message, duration })),
    [dispatch]
  );

  const showErrorAction = useCallback(
    (title: string, message?: string, duration?: number) =>
      dispatch(showError({ title, message, duration })),
    [dispatch]
  );

  const showWarningAction = useCallback(
    (title: string, message?: string, duration?: number) =>
      dispatch(showWarning({ title, message, duration })),
    [dispatch]
  );

  const showInfoAction = useCallback(
    (title: string, message?: string, duration?: number) =>
      dispatch(showInfo({ title, message, duration })),
    [dispatch]
  );

  return useMemo(
    () => ({
      // 基础操作
      showToast: showToastAction,
      removeToast: removeToastAction,
      clearAllToasts: clearAllToastsAction,

      // 基础类型
      showSuccess: showSuccessAction,
      showError: showErrorAction,
      showWarning: showWarningAction,
      showInfo: showInfoAction,
    }),
    [
      showToastAction,
      removeToastAction,
      clearAllToastsAction,
      showSuccessAction,
      showErrorAction,
      showWarningAction,
      showInfoAction,
    ]
  );
};
