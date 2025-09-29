import { useCallback, useMemo } from "react";
import {
  clearDicts,
  clearDictsByType,
  clearError as clearDictsError,
  fetchDicts,
  fetchMultipleDicts,
  setDicts,
  setLoading as setDictsLoading,
} from "../slices/dictsSlice";
import { useAppDispatch, useAppSelector } from "./baseHooks";

// 词典相关的选择器
export const useDicts = () => {
  return useAppSelector((state) => state.dicts);
};

// 词典操作
export const useDictsActions = () => {
  const dispatch = useAppDispatch();

  const setDictsAction = useCallback(
    (dicts: any) => dispatch(setDicts(dicts)),
    [dispatch]
  );

  const setLoadingAction = useCallback(
    (loading: boolean) => dispatch(setDictsLoading(loading)),
    [dispatch]
  );

  const clearDictsAction = useCallback(
    () => dispatch(clearDicts()),
    [dispatch]
  );

  const clearDictsByTypeAction = useCallback(
    (type: string) => dispatch(clearDictsByType(type)),
    [dispatch]
  );

  const clearErrorAction = useCallback(
    () => dispatch(clearDictsError()),
    [dispatch]
  );

  const fetchDictsAction = useCallback(
    (dictType: string) => dispatch(fetchDicts(dictType)),
    [dispatch]
  );

  const fetchMultipleDictsAction = useCallback(
    (dictTypes: string[]) => dispatch(fetchMultipleDicts(dictTypes)),
    [dispatch]
  );

  return useMemo(
    () => ({
      setDicts: setDictsAction,
      setLoading: setLoadingAction,
      clearDicts: clearDictsAction,
      clearDictsByType: clearDictsByTypeAction,
      clearError: clearErrorAction,
      fetchDicts: fetchDictsAction,
      fetchMultipleDicts: fetchMultipleDictsAction,
    }),
    [
      setDictsAction,
      setLoadingAction,
      clearDictsAction,
      clearDictsByTypeAction,
      clearErrorAction,
      fetchDictsAction,
      fetchMultipleDictsAction,
    ]
  );
};
