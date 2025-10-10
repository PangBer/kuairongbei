import { userInfoApi } from "@/service";
import { getToken, removeToken } from "@/utils/token";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// 认证状态接口
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: any;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  userInfo: null,
  error: null,
};

// 异步 thunk：检查认证状态
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();
      if (token) {
        return { isAuthenticated: true };
      } else {
        return { isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue("检查认证状态失败");
    }
  }
);

// 异步 thunk：登录
export const login = createAsyncThunk(
  "auth/login",
  async ({ userInfo }: { userInfo: any }, { rejectWithValue }) => {
    try {
      return { userInfo };
    } catch (error) {
      return rejectWithValue("登录失败");
    }
  }
);

// 异步 thunk：登出
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await removeToken();
      debugger;
      // 清除所有相关的state
      dispatch(clearAllUserData());
      return true;
    } catch (error) {
      return rejectWithValue("登出失败");
    }
  }
);

// 异步 thunk：更新用户信息
export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async (userInfo: any, { rejectWithValue }) => {
    try {
      const response = await userInfoApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "更新用户信息失败"
      );
    }
  }
);

// 认证 slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    // 清除所有用户数据
    clearAllUserData: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = null;
    },
    // 注意：updateUserInfo 现在是异步 thunk，不再需要同步 reducer
  },
  extraReducers: (builder) => {
    // 检查认证状态
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        if (!action.payload.isAuthenticated) {
          state.userInfo = null;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = action.payload as string;
      });

    // 登录
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload.userInfo;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 登出
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 更新用户信息
    builder
      .addCase(updateUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出 actions
export const { setLoading, clearError, clearAllUserData } = authSlice.actions;

// 导出 reducer
export default authSlice.reducer;
