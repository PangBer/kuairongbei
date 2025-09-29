import { citysApi, dictsApi } from "@/service";
import { cityformatData } from "@/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// 字典项接口
export interface DictItem {
  dictLabel: string;
  dictValue: string | number;
  listClass?: string;
  label?: string;
  value?: string | number;
  [key: string]: any;
}

// 字典状态接口
interface DictsState {
  dicts: Record<string, DictItem[]>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// 初始状态
const initialState: DictsState = {
  dicts: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const fetchData = (dictType: string) => {
  if (dictType === "citys_collect") {
    return citysApi({
      level: 2,
    });
  } else {
    return dictsApi(dictType as string);
  }
};
const formatData = (dictType: string, data: any) => {
  if (dictType === "citys_collect") {
    return cityformatData(data);
  } else {
    return data.map((item: any) => ({
      ...item,
      label: item.dictLabel,
      value: item.dictValue,
    }));
  }
};

// 异步 thunk：获取字典数据
export const fetchDicts = createAsyncThunk(
  "dicts/fetchDicts",
  async (dictType: string, { getState, rejectWithValue }) => {
    const state: any = getState();
    try {
      const dicts = state.dicts.dicts;

      if (!dicts[dictType]) {
        const response = await fetchData(dictType);
        return {
          type: dictType,
          data: formatData(dictType, response.data),
        };
      }
      throw new Error("字典数据已存在");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "获取字典数据失败"
      );
    }
  }
);

// 异步 thunk：批量获取字典数据
export const fetchMultipleDicts = createAsyncThunk(
  "dicts/fetchMultipleDicts",

  async (dictTypes: string[], { getState, rejectWithValue }) => {
    const state: any = getState();

    try {
      const dicts = state.dicts.dicts;
      const filterTypes = dictTypes.filter((type) => !dicts[type]);

      // 这里可以添加批量 API 调用
      const responses = await Promise.all(
        filterTypes.map((type) => fetchData(type))
      );

      // 模拟数据
      const mockData: Record<string, DictItem[]> = {};
      filterTypes.forEach((type: string, index: number) => {
        mockData[type] = formatData(type, responses[index].data);
      });

      return mockData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "获取字典数据失败"
      );
    }
  }
);

// 字典 slice
const dictsSlice = createSlice({
  name: "dicts",
  initialState,
  reducers: {
    // 设置字典数据
    setDicts: (
      state,
      action: PayloadAction<{ type: string; data: DictItem[] }>
    ) => {
      state.dicts[action.payload.type] = action.payload.data;
      state.lastUpdated = new Date().toISOString();
    },
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    // 清空字典数据
    clearDicts: (state) => {
      state.dicts = {};
      state.lastUpdated = null;
    },
    // 清空指定类型的字典数据
    clearDictsByType: (state, action: PayloadAction<string>) => {
      delete state.dicts[action.payload];
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // 获取字典数据
    builder
      .addCase(fetchDicts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDicts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dicts[action.payload.type] = action.payload.data;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDicts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 批量获取字典数据
    builder
      .addCase(fetchMultipleDicts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMultipleDicts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dicts = { ...state.dicts, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMultipleDicts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出 actions
export const {
  setDicts,
  setLoading,
  clearError,
  clearDicts,
  clearDictsByType,
} = dictsSlice.actions;

// 导出 reducer
export default dictsSlice.reducer;
