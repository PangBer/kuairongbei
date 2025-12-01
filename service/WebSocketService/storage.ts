import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatItem, Message } from "./index";

// 存储键前缀
const STORAGE_KEYS = {
  CHAT_LIST: "chat_list",
  MESSAGES_PREFIX: "messages_",
  DRAFTS_PREFIX: "draft_",
};

/**
 * 消息存储服务类
 * 负责消息的本地持久化存储和检索
 */
export class MessageStorageService {
  /**
   * 保存消息到本地存储
   * @param message 消息对象
   */
  async saveMessage(message: Message): Promise<void> {
    try {
      // 获取该聊天对象的现有消息列表
      const existingMessages = await this.getMessagesByChatId(message.chatId);
      if (!message.id) {
        const defMessage = existingMessages.findIndex((e) => !e.id);
        // 添加新消息到列表中
        if (defMessage > -1) {
          existingMessages.splice(defMessage, 1);
        }
      }
      existingMessages.push(message);

      // 按时间戳排序
      existingMessages.sort((a, b) => a.timestamp - b.timestamp);

      // 保存更新后的消息列表
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${message.chatId}`;
      await AsyncStorage.setItem(key, JSON.stringify(existingMessages));

      // 更新聊天列表中的最后消息信息
      await this.updateChatListWithLastMessage(message);
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  }

  /**
   * 批量保存消息
   * @param chatId 聊天对象ID
   * @param messages 消息列表
   */
  async saveMessages(chatId: string, messages: Message[]): Promise<void> {
    try {
      // 获取现有消息
      const existingMessages = await this.getMessagesByChatId(chatId);

      // 合并并去重
      const messageMap = new Map<string, Message>();

      // 先添加现有消息
      existingMessages.forEach((msg) => {
        messageMap.set(msg.id, msg);
      });

      // 再添加新消息（可能会覆盖旧消息，用于更新状态）
      messages.forEach((msg) => {
        messageMap.set(msg.id, msg);
      });

      // 转换回数组并排序
      const mergedMessages = Array.from(messageMap.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      );

      // 保存
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`;
      await AsyncStorage.setItem(key, JSON.stringify(mergedMessages));

      // 如果有消息，更新聊天列表
      if (messages.length > 0) {
        // 找到最后一条消息
        const lastMessage = messages.sort(
          (a, b) => b.timestamp - a.timestamp
        )[0];
        await this.updateChatListWithLastMessage(lastMessage);
      }
    } catch (error) {
      console.error("Error saving messages batch:", error);
      throw error;
    }
  }

  /**
   * 根据聊天对象ID获取消息列表
   * @param chatId 聊天对象ID
   * @returns 消息列表
   */
  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`;
      const storedMessages = await AsyncStorage.getItem(key);

      if (storedMessages) {
        return JSON.parse(storedMessages);
      }
      return [];
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  /**
   * 获取聊天列表
   * @returns 聊天对象列表
   */
  async getChatList(): Promise<ChatItem[]> {
    try {
      const storedChatList = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_LIST);

      if (storedChatList) {
        return JSON.parse(storedChatList);
      }
      return [];
    } catch (error) {
      console.error("Error getting chat list:", error);
      return [];
    }
  }

  /**
   * 更新聊天对象信息
   * @param chatItem 聊天对象
   */
  async updateChatItem(chatItem: ChatItem): Promise<void> {
    try {
      const chatList = await this.getChatList();

      // 查找是否已存在该聊天对象
      const index = chatList.findIndex((item) => item.id === chatItem.id);

      if (index !== -1) {
        // 更新现有聊天对象
        chatList[index] = { ...chatList[index], ...chatItem };
      } else {
        // 添加新的聊天对象
        chatList.push(chatItem);
      }

      // 按最后消息时间排序（最新的在前）
      chatList.sort((a, b) => {
        const timeA = a.lastMessageTime || 0;
        const timeB = b.lastMessageTime || 0;
        return timeB - timeA;
      });

      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_LIST,
        JSON.stringify(chatList)
      );
    } catch (error) {
      console.error("Error updating chat item:", error);
      throw error;
    }
  }

  /**
   * 更新聊天列表中的最后消息信息
   * @param message 最新消息
   */
  private async updateChatListWithLastMessage(message: Message): Promise<void> {
    try {
      const chatList = await this.getChatList();

      // 查找该聊天对象
      const chatIndex = chatList.findIndex(
        (item) => item.id === message.chatId
      );

      if (chatIndex !== -1) {
        // 更新现有聊天对象的最后消息信息
        chatList[chatIndex].lastMessage = this.getMessagePreview(message);
        chatList[chatIndex].lastMessageTime = message.timestamp;

        // 如果是收到的新消息，增加未读数
        if (message.sender === "client") {
          if (message.id) {
            chatList[chatIndex].unreadCount += 1;
          } else {
            chatList[chatIndex].unreadCount = 1;
          }
          chatList[chatIndex].goId = message.goId || message.chatId;
        }
      } else {
        // 如果是新的聊天对象，创建并添加
        const newChat: ChatItem = {
          id: message.chatId,
          goId: message.goId || message.chatId,
          title: message.chatName, // 实际应用中应该从其他地方获取标题
          lastMessage: this.getMessagePreview(message),
          lastMessageTime: message.timestamp,
          unreadCount: message.sender === "client" ? 1 : 0,
          icon: message.chatId === "000000" ? "notification" : "bank",
        };
        chatList.push(newChat);
      }

      // 按最后消息时间排序
      chatList.sort((a, b) => {
        const timeA = a.lastMessageTime || 0;
        const timeB = b.lastMessageTime || 0;
        return timeB - timeA;
      });

      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_LIST,
        JSON.stringify(chatList)
      );
    } catch (error) {
      console.error("Error updating chat list with last message:", error);
    }
  }

  /**
   * 清除指定聊天对象的未读消息数
   * @param chatId 聊天对象ID
   */
  async clearUnreadCount(chatId: string): Promise<void> {
    try {
      const chatList = await this.getChatList();
      const chatIndex = chatList.findIndex((item) => item.id === chatId);

      if (chatIndex !== -1) {
        chatList[chatIndex].unreadCount = 0;
        await AsyncStorage.setItem(
          STORAGE_KEYS.CHAT_LIST,
          JSON.stringify(chatList)
        );
      }
    } catch (error) {
      console.error("Error clearing unread count:", error);
      throw error;
    }
  }

  /**
   * 清除所有聊天对象的未读消息数
   */
  async clearAllUnreadCounts(): Promise<void> {
    try {
      const chatList = await this.getChatList();
      chatList.forEach((item) => {
        item.unreadCount = 0;
      });
      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_LIST,
        JSON.stringify(chatList)
      );
    } catch (error) {
      console.error("Error clearing all unread counts:", error);
      throw error;
    }
  }

  /**
   * 更新消息状态
   * @param chatId 聊天对象ID
   * @param messageId 消息ID
   * @param status 新状态
   */
  async updateMessageStatus(
    chatId: string,
    messageId: string,
    status: Message["status"]
  ): Promise<void> {
    try {
      const messages = await this.getMessagesByChatId(chatId);
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);

      if (messageIndex !== -1) {
        messages[messageIndex].status = status;
        const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`;
        await AsyncStorage.setItem(key, JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      throw error;
    }
  }

  /**
   * 保存草稿消息
   * @param chatId 聊天对象ID
   * @param draft 草稿内容
   */
  async saveDraft(chatId: string, draft: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.DRAFTS_PREFIX}${chatId}`;
      await AsyncStorage.setItem(key, draft);
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  }

  /**
   * 获取草稿消息
   * @param chatId 聊天对象ID
   * @returns 草稿内容
   */
  async getDraft(chatId: string): Promise<string | null> {
    try {
      const key = `${STORAGE_KEYS.DRAFTS_PREFIX}${chatId}`;
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting draft:", error);
      return null;
    }
  }

  /**
   * 清除草稿消息
   * @param chatId 聊天对象ID
   */
  async clearDraft(chatId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.DRAFTS_PREFIX}${chatId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error clearing draft:", error);
      throw error;
    }
  }

  /**
   * 删除指定聊天的所有消息
   * @param chatId 聊天对象ID
   */
  async deleteChatMessages(chatId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`;
      await AsyncStorage.removeItem(key);

      // 同时删除草稿
      const draftKey = `${STORAGE_KEYS.DRAFTS_PREFIX}${chatId}`;
      await AsyncStorage.removeItem(draftKey);
    } catch (error) {
      console.error("Error deleting chat messages:", error);
      throw error;
    }
  }

  /**
   * 清空所有消息和聊天列表
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();

      // 找出所有与聊天相关的键
      const chatKeys = keys.filter(
        (key) =>
          key.startsWith(STORAGE_KEYS.MESSAGES_PREFIX) ||
          key.startsWith(STORAGE_KEYS.DRAFTS_PREFIX) ||
          key === STORAGE_KEYS.CHAT_LIST
      );

      if (chatKeys.length > 0) {
        await AsyncStorage.multiRemove(chatKeys);
      }
    } catch (error) {
      console.error("Error clearing all chat data:", error);
      throw error;
    }
  }

  /**
   * 获取消息预览文本
   * @param message 消息对象
   * @returns 预览文本
   */
  private getMessagePreview(message: Message): string {
    switch (message.type) {
      case "text":
        // 限制预览文本长度
        return message.content.length > 50
          ? message.content.substring(0, 50) + "..."
          : message.content;
      case "image":
        return "[图片]";
      case "file":
        return "[文件]";
      case "system":
        return "[系统消息]";
      default:
        return "[未知消息类型]";
    }
  }
}

// 创建消息存储服务实例
export const messageStorage = new MessageStorageService();

// 导出默认实例
export default messageStorage;
