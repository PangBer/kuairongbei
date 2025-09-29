import AsyncStorage from "@react-native-async-storage/async-storage";

// Token 存储的 key
const TOKEN_KEY = "my-token";

/**
 * Token 管理工具类
 */
export class TokenManager {
  /**
   * 保存 token
   * @param token 要保存的 token
   */
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log("Token 保存成功");
    } catch (error) {
      console.error("Token 保存失败:", error);
      throw error;
    }
  }

  /**
   * 获取 token
   * @returns 返回 token 或 null
   */
  static async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error("Token 获取失败:", error);
      return null;
    }
  }

  /**
   * 删除 token
   */
  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log("Token 删除成功");
    } catch (error) {
      console.error("Token 删除失败:", error);
      throw error;
    }
  }

  /**
   * 检查是否有 token
   * @returns 返回是否有 token
   */
  static async hasToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token !== null && token !== "";
    } catch (error) {
      console.error("检查 token 失败:", error);
      return false;
    }
  }

  /**
   * 清除所有存储的数据
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log("所有数据清除成功");
    } catch (error) {
      console.error("清除数据失败:", error);
      throw error;
    }
  }
}

// 导出便捷方法
export const setToken = TokenManager.setToken;
export const getToken = TokenManager.getToken;
export const removeToken = TokenManager.removeToken;
export const hasToken = TokenManager.hasToken;
export const clearAll = TokenManager.clearAll;
