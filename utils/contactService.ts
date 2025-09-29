import { Linking } from "react-native";

/**
 * 联系客服配置
 */

export interface ContactServiceConfig {
  wechatId: string;
  webContactUrl?: string; // Web端联系客服的HTTP链接
  serviceHours: string;
  emergencyContact?: string;
  email?: string;
  phone?: string;
}

// 默认客服配置
export const defaultContactConfig: ContactServiceConfig = {
  wechatId: "wxid_vq0ngn73l73d22", // 请替换为实际的企业微信ID
  webContactUrl: "https://work.weixin.qq.com/ca/cawcde231c19052561", // Web端联系客服链接
  serviceHours: "周一至周五 9:00-18:00",
  emergencyContact: "紧急情况请联系: 400-12345678",
  email: "service@163.com",
  phone: "400-12345678",
};

/**
 * 打开微信添加联系人
 * @param wechatId 微信ID
 * @returns Promise<boolean> 是否成功打开
 */
export const openWechatAddContact = async (
  wechatId: string
): Promise<boolean> => {
  try {
    // 检查微信是否安装
    const wechatUrl = "weixin://";
    const canOpenWechat = await Linking.canOpenURL(wechatUrl);

    if (!canOpenWechat) {
      throw new Error("未检测到微信应用");
    }

    // 尝试直接添加联系人
    const addContactUrl = `weixin://dl/business/?ticket=${wechatId}`;
    const opened = await Linking.openURL(addContactUrl);

    return opened;
  } catch (error) {
    console.error("打开微信失败:", error);
    return false;
  }
};

/**
 * 获取客服信息文本
 * @param config 客服配置
 * @returns string 客服信息
 */
export const getServiceInfoText = (config: ContactServiceConfig): string => {
  let info = `客服微信ID: ${config.wechatId}\n\n工作时间: ${config.serviceHours}`;

  if (config.emergencyContact) {
    info += `\n\n${config.emergencyContact}`;
  }

  if (config.email) {
    info += `\n\n邮箱: ${config.email}`;
  }

  if (config.phone) {
    info += `\n\n电话: ${config.phone}`;
  }

  return info;
};

/**
 * 检查微信是否安装
 * @returns Promise<boolean> 是否安装微信
 */
export const checkWechatInstalled = async (): Promise<boolean> => {
  try {
    const wechatUrl = "weixin://";
    return await Linking.canOpenURL(wechatUrl);
  } catch (error) {
    console.error("检查微信安装状态失败:", error);
    return false;
  }
};
