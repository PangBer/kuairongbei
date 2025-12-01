import { getToken } from "@/utils/token";
import messageStorage, { MessageStorageService } from "./storage";

// WebSocket连接状态枚举
export enum ConnectionStatus {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  ERROR = "error",
}
// 导出消息状态类型
export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "pending";
// 消息类型枚举
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  SYSTEM = "system",
}

// 消息接口定义
export interface Message {
  id: string;
  chatId: string; // 聊天对象ID
  chatName: string; // 聊天对象名称
  sender: "mobile" | "client";
  toId: string; // 接收者ID
  toName: string; // 接收者名称
  goId: string; // 群ID
  type: MessageType;
  content: string;
  timestamp: number;
  status?: MessageStatus;
}

// 聊天对象接口
export interface ChatItem {
  id: string;
  goId: string; // 群ID
  title: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  icon?: string;
}

// WebSocket配置接口
interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  pingInterval?: number;
}

/**
 * 生成唯一的消息ID
 * @returns 消息ID
 */
export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
/**
 * WebSocket聊天服务类
 * 负责WebSocket连接管理、消息收发、断线重连等核心功能
 */
export class WebSocketService {
  public ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private pingTimer: number | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private messageListeners: Map<string, Set<(message: Message) => void>> =
    new Map();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private isManualDisconnect = false;
  private storageService: MessageStorageService = messageStorage;
  private staticUrl: string = `${__DEV__ ? "ws" : "wss"}://${
    process.env.EXPO_PUBLIC_BASE_IP
  }/resource/chat`;
  private generateMessageId = generateMessageId;
  /**
   * 构造函数
   * @param config WebSocket配置
   * @param storage 消息存储服务实例
   */
  constructor() {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      pingInterval: 30000,
      url: this.staticUrl,
    };

    this.initDefaultHandlers();
  }

  /**
   * 初始化默认消息处理器
   */
  private initDefaultHandlers(): void {
    // 处理接收到的消息并保存到本地存储
    this.onMessage("*", async (message: Message) => {
      if (message.sender === "client") {
        try {
          // 通知消息监听器
          await this.storageService.saveMessage({
            ...message,
            chatId: message.toId,
            chatName: message.toName,
            toId: message.chatId,
            toName: message.chatName,
          });
        } catch (error) {
          console.error("保存接收到的消息失败:", error);
        }
      }
    });
  }

  /**
   * 连接WebSocket服务器
   */
  async connect(): Promise<void> {
    const token: any = await getToken();
    const encodedToken = encodeURIComponent(`Bearer ${token}`);
    this.config.url = `${this.staticUrl}?Authorization=${encodedToken}&clientid=${process.env.EXPO_PUBLIC_CLIENT_ID}`;
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.isManualDisconnect = false;
    this.updateStatus(ConnectionStatus.CONNECTING);

    try {
      // 在实际环境中，这里应该使用真实的WebSocket地址
      // 现在使用模拟地址，在实际运行时会失败，这是正常的
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.updateStatus(ConnectionStatus.ERROR);
      this.attemptReconnect();
    }
  }

  /**
   * 发送消息
   * @param chatId 聊天对象ID
   * @param message 消息内容
   * @param type 消息类型
   * @param toId 接收者ID
   * @returns 消息ID
   */
  async sendMessage(messageData: Message): Promise<string> {
    const messageId = this.generateMessageId();

    // 先保存到本地存储（乐观更新）
    try {
      await this.storageService.saveMessage(messageData);
    } catch (error) {
      console.error("保存消息失败:", error);
    }

    // 使用WebSocket发送消息（原有逻辑）
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        const wsMessage = {
          type: "message",
          goId: messageData.goId,
          data: messageData,
        };

        this.ws.send(JSON.stringify(wsMessage));
        messageData.status = "sent";

        // 更新本地消息状态为已发送
        try {
          await this.storageService.updateMessageStatus(
            messageData.chatId,
            messageId,
            "sent"
          );
        } catch (error) {
          console.error("更新消息状态失败:", error);
        }
      } catch (error) {
        console.error("Failed to send message via WebSocket:", error);
        messageData.status = "failed";

        // 更新本地消息状态为发送失败
        try {
          await this.storageService.updateMessageStatus(
            messageData.chatId,
            messageId,
            "failed"
          );
        } catch (error) {
          console.error("更新消息状态失败:", error);
        }
      }
    } else {
      console.warn("WebSocket not connected, message queued");
      messageData.status = "pending";

      // 更新本地消息状态为待发送
      try {
        await this.storageService.updateMessageStatus(
          messageData.chatId,
          messageId,
          "pending"
        );
      } catch (error) {
        console.error("更新消息状态失败:", error);
      }
    }

    // 触发消息监听器
    this.notifyMessageListeners(messageData);

    return messageId;
  }

  /**
   * 重新发送失败的消息
   * @param chatId 聊天对象ID（可选，不传则重发所有失败的消息）
   */
  async resendFailedMessages(chatId?: string): Promise<void> {
    // 只有在使用WebSocket方式时才检查连接状态
    if (!this.isConnected()) {
      console.error("未连接，无法使用WebSocket重发消息");
      return;
    }

    try {
      let failedMessages: Message[] = [];

      if (chatId) {
        // 获取特定聊天的失败消息
        const messages = await this.storageService.getMessagesByChatId(chatId);
        failedMessages = messages.filter(
          (msg) =>
            msg.sender === "mobile" &&
            (msg.status === "failed" || msg.status === "pending")
        );
      } else {
        // 获取所有聊天的失败消息
        const chats = await this.storageService.getChatList();
        for (const chat of chats) {
          const messages = await this.storageService.getMessagesByChatId(
            chat.id
          );
          const chatFailedMessages = messages.filter(
            (msg) =>
              msg.sender === "mobile" &&
              (msg.status === "failed" || msg.status === "pending")
          );
          failedMessages = [...failedMessages, ...chatFailedMessages];
        }
      }

      // 按时间戳排序，先发送较早的消息
      failedMessages.sort((a, b) => a.timestamp - b.timestamp);

      // 逐个重发
      for (const msg of failedMessages) {
        // 更新状态为发送中
        await this.storageService.updateMessageStatus(
          msg.chatId,
          msg.id,
          "sending"
        );

        try {
          // 使用WebSocket重发消息（原有逻辑）
          const wsMessage = {
            type: "message",
            goId: msg.goId,
            data: msg,
          };

          this.ws?.send(JSON.stringify(wsMessage));
          console.log("通过WebSocket重发消息:", msg);

          // 更新状态为已发送
          await this.storageService.updateMessageStatus(
            msg.chatId,
            msg.id,
            "sent"
          );

          // 通知监听器消息状态更新
          this.notifyMessageListeners({ ...msg, status: "sent" });
        } catch (error) {
          console.error(`通过WebSocket重发消息失败:`, msg, error);
          // 更新状态为发送失败
          await this.storageService.updateMessageStatus(
            msg.chatId,
            msg.id,
            "failed"
          );
          // 通知监听器消息状态更新
          this.notifyMessageListeners({ ...msg, status: "failed" });
        }
      }
    } catch (error) {
      console.error("重发失败消息时出错:", error);
    }
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.CONNECTED;
  }

  /**
   * 注册消息监听器
   * @param chatId 聊天对象ID
   * @param listener 消息回调函数
   */
  onMessage(chatId: string, listener: (message: Message) => void): void {
    if (!this.messageListeners.has(chatId)) {
      this.messageListeners.set(chatId, new Set());
    }

    this.messageListeners.get(chatId)?.add(listener);
  }

  /**
   * 移除消息监听器
   * @param chatId 聊天对象ID
   * @param listener 消息回调函数
   */
  offMessage(chatId: string, listener: (message: Message) => void): void {
    const listeners = this.messageListeners.get(chatId);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.messageListeners.delete(chatId);
      }
    }
  }

  /**
   * 注册连接状态监听器
   * @param listener 状态回调函数
   */
  onStatusChange(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners.add(listener);
  }

  /**
   * 移除连接状态监听器
   * @param listener 状态回调函数
   */
  offStatusChange(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners.delete(listener);
  }

  /**
   * 获取当前连接状态
   */
  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * WebSocket连接打开处理
   */
  private handleOpen(): void {
    this.updateStatus(ConnectionStatus.CONNECTED);
    this.reconnectAttempts = 0;
    this.startPing();

    // 发送连接确认消息
    this.sendConnectionAck();

    // 尝试重发失败的消息
    this.resendFailedMessages().catch((error) => {
      console.error("重发失败消息失败:", error);
    });
  }

  /**
   * WebSocket消息接收处理
   * @param event 消息事件
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      // 处理不同类型的消息
      switch (data.type) {
        case "message":
          this.handleIncomingMessage(data.data);
          break;
        case "ping":
          this.handlePing();
          break;
        case "typing":
          this.handleTyping(data.data);
          break;
        case "read":
          this.handleReadReceipt(data.data);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  /**
   * WebSocket错误处理
   * @param error 错误事件
   */
  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
    this.updateStatus(ConnectionStatus.ERROR);
  }

  /**
   * WebSocket连接关闭处理
   * @param event 关闭事件
   */
  private handleClose(event: CloseEvent): void {
    console.log("WebSocket disconnected:", event.code, event.reason);

    // 清除ping定时器
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }

    // 如果不是手动断开连接，尝试重连
    if (!this.isManualDisconnect) {
      this.updateStatus(ConnectionStatus.DISCONNECTED);
      this.attemptReconnect();
    }
  }

  /**
   * 处理接收到的消息
   * @param message 消息数据
   */
  private handleIncomingMessage(message: Message): void {
    // 确保消息有必要的字段
    if (!message.chatId) {
      console.error("Incoming message missing chatId");
      return;
    }

    // 设置接收方为other
    message.sender = "client";
    message.status = "delivered";

    // 触发消息监听器
    this.notifyMessageListeners(message);

    // 发送已读回执
    this.sendReadReceipt(message.toId, message.id);
  }

  /**
   * 处理ping消息
   */
  private handlePing(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "pong" }));
    }
  }

  /**
   * 处理打字状态消息
   * @param data 打字状态数据
   */
  private handleTyping(data: { chatId: string; isTyping: boolean }): void {
    // 可以在这里处理打字状态逻辑
    console.log("Typing status:", data);
  }

  /**
   * 处理已读回执
   * @param data 已读回执数据
   */
  private handleReadReceipt(data: {
    chatId: string;
    messageIds: string[];
  }): void {
    // 可以在这里更新消息状态为已读
    console.log("Read receipt:", data);
  }

  /**
   * 发送已读回执
   * @param chatId 聊天对象ID
   * @param messageId 消息ID
   */
  private async sendReadReceipt(
    chatId: string,
    messageId: string
  ): Promise<void> {
    try {
      // 使用WebSocket发送已读回执（原有逻辑）
      if (this.ws?.readyState === WebSocket.OPEN) {
        const readReceipt = {
          type: "read",
          goId: chatId,
          data: {
            chatId,
            messageIds: [messageId],
          },
        };
        this.ws.send(JSON.stringify(readReceipt));
      }
    } catch (error) {
      console.error(`通过WebSocket发送已读回执失败:`, error);
    }
  }

  /**
   * 发送连接确认消息
   */
  private sendConnectionAck(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const ack = {
        type: "connected_ok",
        data: {
          timestamp: Date.now(),
          // 可以添加用户标识等信息
        },
      };
      this.ws.send(JSON.stringify(ack));
    }
  }

  /**
   * 开始发送ping消息保持连接
   */
  private startPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }

    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, this.config.pingInterval);
  }

  /**
   * 尝试重新连接
   */
  private attemptReconnect(): void {
    if (this.isManualDisconnect) {
      return;
    }

    // 检查重连次数是否超过最大值
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error("Max reconnection attempts reached");
      this.updateStatus(ConnectionStatus.ERROR);
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`
    );

    // 设置重连定时器
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  /**
   * 通知消息监听器
   * @param message 消息数据
   */
  private notifyMessageListeners(message: Message): void {
    // 通知特定聊天的监听器
    const chatListeners = this.messageListeners.get(message.toId);
    if (chatListeners) {
      chatListeners.forEach((listener) => {
        try {
          listener(message);
        } catch (error) {
          console.error("Error in message listener:", error);
        }
      });
    }

    // 通知所有聊天的监听器（可以用于更新未读消息计数等）
    const allListeners = this.messageListeners.get("*");
    if (allListeners) {
      allListeners.forEach((listener) => {
        try {
          listener(message);
        } catch (error) {
          console.error("Error in global message listener:", error);
        }
      });
    }
    // 通知界面的全部聊天的监听器（可以用于更新未读消息计数等）
    const pageallListeners = this.messageListeners.get("all");
    if (pageallListeners) {
      pageallListeners.forEach((listener) => {
        try {
          listener(message);
        } catch (error) {
          console.error("Error in global message listener:", error);
        }
      });
    }
  }

  /**
   * 更新连接状态并通知监听器
   * @param status 新的连接状态
   */
  private updateStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;

    this.statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        console.error("Error in status listener:", error);
      }
    });
  }
}

// 创建WebSocket服务实例
export const wsService = new WebSocketService();

// 导出默认服务
export default wsService;

// 导出WebSocket服务和消息存储服务相关内容
export { messageStorage, MessageStorageService };
