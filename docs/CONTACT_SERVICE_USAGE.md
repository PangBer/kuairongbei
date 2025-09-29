# 联系客服功能使用文档

## 概述

联系客服功能提供了跨平台的客服联系方式，支持 Web 端和 App 端不同的交互方式，帮助用户快速联系客服团队获取支持。

## 功能特性

- ✅ 跨平台支持（Web、iOS、Android）
- ✅ Web 端直接打开企业微信联系页面
- ✅ App 端自动打开微信添加客服
- ✅ 智能检测微信安装状态
- ✅ 可配置的客服信息
- ✅ 优雅的错误处理
- ✅ 支持自定义样式和布局

## 核心组件

### ContactService 组件

主要的联系客服组件，提供完整的用户界面和交互功能。

#### 基本用法

```tsx
import ContactService from "@/components/ContactService";

function MyComponent() {
  const handleContactPress = () => {
    console.log("用户点击了联系客服");
  };

  return (
    <ContactService
      title="联系客服"
      description="点击联系我们的客服团队"
      wechatId="your-wechat-id"
      webContactUrl="https://work.weixin.qq.com/ca/your-contact-url"
      onContactPress={handleContactPress}
    />
  );
}
```

#### 属性配置

| 属性             | 类型         | 默认值                   | 描述                       |
| ---------------- | ------------ | ------------------------ | -------------------------- |
| `title`          | `string`     | "联系客服"               | 组件标题                   |
| `description`    | `string`     | "点击联系我们的客服团队" | 组件描述                   |
| `wechatId`       | `string`     | "your-wechat-id"         | 企业微信 ID                |
| `webContactUrl`  | `string`     | -                        | Web 端联系客服的 HTTP 链接 |
| `showCard`       | `boolean`    | `true`                   | 是否显示卡片样式           |
| `buttonText`     | `string`     | "联系客服"               | 按钮文本                   |
| `onContactPress` | `() => void` | -                        | 联系客服前的回调函数       |

#### 简化用法

```tsx
// 只显示按钮，不显示卡片
<ContactService
  showCard={false}
  buttonText="联系客服"
  wechatId="your-wechat-id"
/>
```

## 工具函数

### contactService 工具

提供联系客服的核心功能函数。

#### 基础配置

```tsx
import { defaultContactConfig } from "@/utils/contactService";

// 默认配置
const config = {
  wechatId: "wxid_vq0ngn73l73d22",
  webContactUrl: "https://work.weixin.qq.com/ca/cawcde231c19052561",
  serviceHours: "周一至周五 9:00-18:00",
  emergencyContact: "紧急情况请联系: 400-12345678",
  email: "service@163.com",
  phone: "400-12345678",
};
```

#### 核心函数

```tsx
import {
  openWechatAddContact,
  getServiceInfoText,
  checkWechatInstalled,
} from "@/utils/contactService";

// 打开微信添加联系人
const handleAddContact = async (wechatId) => {
  const success = await openWechatAddContact(wechatId);
  if (success) {
    console.log("成功打开微信");
  } else {
    console.log("打开微信失败");
  }
};

// 获取客服信息文本
const serviceInfo = getServiceInfoText(config);
console.log(serviceInfo);

// 检查微信是否安装
const isWechatInstalled = await checkWechatInstalled();
console.log("微信已安装:", isWechatInstalled);
```

## 使用方法

### 1. 基础联系客服

```tsx
function BasicContactExample() {
  return (
    <ContactService
      title="需要帮助？"
      description="我们的客服团队随时为您服务"
      wechatId="your-wechat-id"
      webContactUrl="https://work.weixin.qq.com/ca/your-contact-url"
    />
  );
}
```

### 2. 自定义配置

```tsx
function CustomContactExample() {
  const handleContactPress = () => {
    // 记录用户联系客服的行为
    analytics.track("contact_service_clicked");
  };

  return (
    <ContactService
      title="技术支持"
      description="遇到技术问题？联系我们的技术团队"
      wechatId="tech-support-id"
      webContactUrl="https://work.weixin.qq.com/ca/tech-support"
      buttonText="联系技术支持"
      onContactPress={handleContactPress}
    />
  );
}
```

### 3. 简化按钮样式

```tsx
function SimpleButtonExample() {
  return (
    <View style={styles.helpSection}>
      <Text>需要帮助？</Text>
      <ContactService
        showCard={false}
        buttonText="联系客服"
        wechatId="your-wechat-id"
        webContactUrl="https://work.weixin.qq.com/ca/your-contact-url"
      />
    </View>
  );
}
```

### 4. 多个客服选项

```tsx
function MultipleContactExample() {
  return (
    <View>
      <ContactService
        title="销售咨询"
        description="了解产品详情和价格"
        wechatId="sales-id"
        webContactUrl="https://work.weixin.qq.com/ca/sales"
        buttonText="联系销售"
      />

      <ContactService
        title="技术支持"
        description="解决技术问题和故障"
        wechatId="tech-id"
        webContactUrl="https://work.weixin.qq.com/ca/tech"
        buttonText="联系技术支持"
      />

      <ContactService
        title="售后服务"
        description="处理退换货和维修"
        wechatId="service-id"
        webContactUrl="https://work.weixin.qq.com/ca/service"
        buttonText="联系售后服务"
      />
    </View>
  );
}
```

## 平台差异处理

### Web 端

```tsx
// Web 端自动处理
if (Platform.OS === "web") {
  // 直接打开企业微信联系页面
  if (webContactUrl) {
    const opened = await Linking.openURL(webContactUrl);
    if (!opened) {
      Alert.alert("提示", "无法打开联系页面，请检查链接是否正确");
    }
  }
}
```

### App 端

```tsx
// App 端自动处理
if (Platform.OS !== "web") {
  // 检查微信是否安装
  const canOpenWechat = await Linking.canOpenURL("weixin://");

  if (!canOpenWechat) {
    Alert.alert("提示", "未检测到微信应用，请先安装微信");
    return;
  }

  // 构建微信添加联系人的URL
  const addContactUrl = `weixin://dl/business/?ticket=${wechatId}`;
  const opened = await Linking.openURL(addContactUrl);

  if (!opened) {
    // 如果直接添加失败，尝试打开微信主界面
    await Linking.openURL("weixin://");
    Alert.alert("提示", "已为您打开微信，请在微信中搜索并添加客服微信");
  }
}
```

## 使用场景

### 1. 帮助页面

```tsx
function HelpPage() {
  return (
    <ScrollView>
      <Text style={styles.title}>帮助中心</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>常见问题</Text>
        {/* 常见问题列表 */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>联系客服</Text>
        <ContactService
          title="在线客服"
          description="7x24小时在线服务"
          wechatId="online-service-id"
          webContactUrl="https://work.weixin.qq.com/ca/online-service"
        />
      </View>
    </ScrollView>
  );
}
```

### 2. 错误页面

```tsx
function ErrorPage() {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>页面加载失败</Text>
      <Text style={styles.errorMessage}>
        抱歉，页面加载出现问题。请检查网络连接或联系客服。
      </Text>

      <ContactService
        title="联系客服"
        description="获取技术支持"
        wechatId="support-id"
        webContactUrl="https://work.weixin.qq.com/ca/support"
        buttonText="联系客服"
      />
    </View>
  );
}
```

### 3. 设置页面

```tsx
function SettingsPage() {
  return (
    <View>
      <Text style={styles.title}>设置</Text>

      <View style={styles.settingItem}>
        <Text>账户设置</Text>
        <Icon name="chevron-right" />
      </View>

      <View style={styles.settingItem}>
        <Text>隐私设置</Text>
        <Icon name="chevron-right" />
      </View>

      <View style={styles.settingItem}>
        <Text>关于我们</Text>
        <Icon name="chevron-right" />
      </View>

      <ContactService
        showCard={false}
        buttonText="联系客服"
        wechatId="your-wechat-id"
        webContactUrl="https://work.weixin.qq.com/ca/your-contact-url"
      />
    </View>
  );
}
```

### 4. 订单页面

```tsx
function OrderPage() {
  return (
    <View>
      <Text style={styles.title}>我的订单</Text>

      {/* 订单列表 */}

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>需要帮助？</Text>
        <ContactService
          title="订单咨询"
          description="关于订单的问题，请联系客服"
          wechatId="order-service-id"
          webContactUrl="https://work.weixin.qq.com/ca/order-service"
          buttonText="联系客服"
        />
      </View>
    </View>
  );
}
```

## 错误处理

### 1. 微信未安装

```tsx
const handleWechatNotInstalled = () => {
  Alert.alert("提示", "未检测到微信应用，请先安装微信", [
    { text: "取消", style: "cancel" },
    { text: "确定", style: "default" },
  ]);
};
```

### 2. 链接打开失败

```tsx
const handleLinkOpenFailed = () => {
  if (Platform.OS === "web") {
    Alert.alert("提示", "无法打开联系页面，请手动访问客服页面");
  } else {
    Alert.alert("提示", "无法打开微信，请手动打开微信并搜索客服微信");
  }
};
```

### 3. 网络错误

```tsx
const handleNetworkError = () => {
  Alert.alert("网络错误", "无法连接到服务器，请检查网络设置", [
    { text: "重试", onPress: () => retryConnection() },
    { text: "取消", style: "cancel" },
  ]);
};
```

## 最佳实践

### 1. 配置管理

```tsx
// 集中管理客服配置
const contactConfig = {
  sales: {
    wechatId: "sales-id",
    webContactUrl: "https://work.weixin.qq.com/ca/sales",
    title: "销售咨询",
    description: "了解产品详情和价格",
  },
  support: {
    wechatId: "support-id",
    webContactUrl: "https://work.weixin.qq.com/ca/support",
    title: "技术支持",
    description: "解决技术问题",
  },
  service: {
    wechatId: "service-id",
    webContactUrl: "https://work.weixin.qq.com/ca/service",
    title: "售后服务",
    description: "处理退换货和维修",
  },
};

// 使用配置
<ContactService {...contactConfig.sales} />;
```

### 2. 用户体验优化

```tsx
function OptimizedContactExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleContactPress = async () => {
    setIsLoading(true);

    try {
      // 记录用户行为
      await analytics.track("contact_service_clicked");

      // 执行联系客服逻辑
      await contactService();
    } catch (error) {
      console.error("联系客服失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContactService
      buttonText={isLoading ? "连接中..." : "联系客服"}
      onContactPress={handleContactPress}
      wechatId="your-wechat-id"
      webContactUrl="https://work.weixin.qq.com/ca/your-contact-url"
    />
  );
}
```

### 3. 响应式设计

```tsx
const styles = StyleSheet.create({
  contactContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  contactButton: {
    minWidth: 120,
    alignSelf: "center",
  },
});
```

### 4. 国际化支持

```tsx
// 多语言支持
const contactTexts = {
  zh: {
    title: "联系客服",
    description: "点击联系我们的客服团队",
    buttonText: "联系客服",
  },
  en: {
    title: "Contact Support",
    description: "Click to contact our support team",
    buttonText: "Contact Support",
  },
};

function InternationalizedContact() {
  const { language } = useLanguage();
  const texts = contactTexts[language];

  return (
    <ContactService
      title={texts.title}
      description={texts.description}
      buttonText={texts.buttonText}
      wechatId="your-wechat-id"
      webContactUrl="https://work.weixin.qq.com/ca/your-contact-url"
    />
  );
}
```

## 注意事项

1. **微信 ID 配置**: 确保使用正确的企业微信 ID
2. **链接有效性**: 定期检查 Web 端联系链接是否有效
3. **权限管理**: 确保应用有打开外部链接的权限
4. **用户体验**: 提供清晰的错误提示和备选方案
5. **隐私保护**: 不要在代码中硬编码敏感的客服信息
6. **测试验证**: 在不同平台上测试联系功能

## 相关文件

- `components/ContactService.tsx` - 主组件
- `utils/contactService.ts` - 工具函数
- `store/slices/toastSlice.ts` - 错误提示集成
