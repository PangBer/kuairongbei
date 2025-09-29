import { useCallback, useMemo } from "react";
import {
  checkAuth,
  clearError,
  login,
  logout,
  setLoading,
  updateUserInfo,
} from "../slices/authSlice";
import { useAppDispatch, useAppSelector } from "./baseHooks";

// 认证相关的选择器
export const useAuth = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const error = useAppSelector((state) => state.auth.error);

  return useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      userInfo,
      error,
    }),
    [isAuthenticated, isLoading, userInfo, error]
  );
};

// 认证操作
export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const loginAction = useCallback(
    (userInfo: any) => dispatch(login({ userInfo })),
    [dispatch]
  );

  const logoutAction = useCallback(() => dispatch(logout()), [dispatch]);

  const checkAuthAction = useCallback(() => dispatch(checkAuth()), [dispatch]);

  const setLoadingAction = useCallback(
    (loading: boolean) => dispatch(setLoading(loading)),
    [dispatch]
  );

  const updateUserInfoAction = useCallback(
    (userInfo: any) => dispatch(updateUserInfo(userInfo)),
    [dispatch]
  );

  const clearErrorAction = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  return useMemo(
    () => ({
      login: loginAction,
      logout: logoutAction,
      checkAuth: checkAuthAction,
      setLoading: setLoadingAction,
      updateUserInfo: updateUserInfoAction,
      clearError: clearErrorAction,
    }),
    [
      loginAction,
      logoutAction,
      checkAuthAction,
      setLoadingAction,
      updateUserInfoAction,
      clearErrorAction,
    ]
  );
};
