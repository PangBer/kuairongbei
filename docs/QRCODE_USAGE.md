# 二维码生成功能使用指南

## 功能概述

本功能支持生成当前页面的二维码，用户扫码后可以：

- **App 扫码**：直接进入对应的功能页面
- **浏览器扫码**：下载 App 或打开 Web 页面
- **Web 端**：直接打开对应的页面

## 核心文件

- `utils/qrcode.ts` - 二维码生成工具函数
- `components/QRCodeDisplay.tsx` - 二维码显示组件
- `app/(Homes)/qrcode/index.tsx` - 演示页面

## 使用方法

### 1. 基础用法

```typescript
import QRCodeDisplay from "@/components/QRCodeDisplay";

// 生成当前页面的二维码
<QRCodeDisplay path="/login" title="登录页面" description="扫码进入登录页面" />;
```

### 2. 带参数的二维码

```typescript
<QRCodeDisplay
  path="/user/profile"
  params={{ id: "123", tab: "info" }}
  title="用户资料"
  description="扫码查看用户资料"
/>
```

### 3. 自定义配置

```typescript
<QRCodeDisplay
  path="/product/123"
  options={{
    size: 300,
    color: "#000000",
    backgroundColor: "#ffffff",
    logo: {
      uri: "https://example.com/logo.png",
      width: 50,
      height: 50,
    },
  }}
  title="商品详情"
  description="扫码查看商品详情"
/>
```

### 4. 网站模式

```typescript
<QRCodeDisplay
  path="/user/profile"
  params={{ id: "123" }}
  useWebsiteMode={true}
  title="用户资料"
  description="网站模式二维码"
/>
```

### 5. 二维码扫描

```typescript
<QRCodeScanner
  onScanSuccess={(data) => {
    console.log("扫描成功:", data);
  }}
  onScanError={(error) => {
    console.error("扫描失败:", error);
  }}
  onClose={() => {
    console.log("关闭扫描器");
  }}
/>
```

## API 参考

### QRCodeDisplay 组件属性

| 属性                 | 类型                        | 默认值                        | 说明               |
| -------------------- | --------------------------- | ----------------------------- | ------------------ |
| `path`               | `string`                    | -                             | 页面路径（必需）   |
| `params`             | `Record<string, any>`       | `{}`                          | 查询参数           |
| `title`              | `string`                    | `'页面二维码'`                | 二维码标题         |
| `description`        | `string`                    | `'使用本App或浏览器扫码访问'` | 描述文字           |
| `showDownloadButton` | `boolean`                   | `true`                        | 是否显示下载按钮   |
| `showShareButton`    | `boolean`                   | `true`                        | 是否显示分享按钮   |
| `options`            | `QRCodeOptions`             | `{}`                          | 二维码配置选项     |
| `onQRCodeGenerated`  | `(dataURL: string) => void` | -                             | 二维码生成完成回调 |

### QRCodeOptions 配置选项

| 属性                   | 类型       | 默认值      | 说明        |
| ---------------------- | ---------- | ----------- | ----------- |
| `size`                 | `number`   | `200`       | 二维码大小  |
| `color`                | `string`   | `'#000000'` | 二维码颜色  |
| `backgroundColor`      | `string`   | `'#FFFFFF'` | 背景颜色    |
| `logo`                 | `object`   | -           | Logo 配置   |
| `logoSize`             | `number`   | -           | Logo 大小   |
| `logoBackgroundColor`  | `string`   | -           | Logo 背景色 |
| `logoMargin`           | `number`   | -           | Logo 边距   |
| `logoBorderRadius`     | `number`   | -           | Logo 圆角   |
| `quietZone`            | `number`   | `0`         | 静默区域    |
| `enableLinearGradient` | `boolean`  | `false`     | 启用渐变    |
| `linearGradient`       | `object`   | -           | 渐变配置    |
| `gradientDirection`    | `string[]` | -           | 渐变方向    |

## 工具函数

### generatePageQRCodeLink

生成页面二维码的链接

```typescript
import { generatePageQRCodeLink } from "@/utils/qrcode";

const link = generatePageQRCodeLink("/login", { id: "123" });
```

### parseQRCodeData

解析二维码内容，提取路径和参数

```typescript
import { parseQRCodeData } from "@/utils/qrcode";

const parsed = parseQRCodeData("kuairongbei://app/user/profile?id=123");
console.log(parsed.type); // 'app'
console.log(parsed.path); // '/user/profile'
console.log(parsed.params); // { id: '123' }
```

### handleQRCodeScan

处理二维码扫描结果

```typescript
import { handleQRCodeScan } from "@/utils/qrcode";

handleQRCodeScan(
  "kuairongbei://app/user/profile?id=123",
  (path, params) => {
    // 导航到对应页面
    router.push({ pathname: path, params });
  },
  (error) => {
    console.error("处理失败:", error);
  }
);
```

### generateWebLink

生成 Web 链接

```typescript
import { generateWebLink } from "@/utils/qrcode";

const webLink = generateWebLink("/user/profile", { id: "123" });
// 输出: https://localhost:8081/user/profile?id=123
```

### generateUniversalLink

生成通用链接（支持 App 和 Web 回退）

```typescript
import { generateUniversalLink } from "@/utils/qrcode";

const universalLink = generateUniversalLink("/user/profile", { id: "123" });
// 输出: https://kuairongbei.com/user/profile?id=123
```

## 扫码行为

### 网站模式 (useWebsiteMode={true})

当使用网站模式时，所有平台都生成统一的 HTTPS 网站链接：

#### 二维码内容

- **统一链接**：`https://localhost:8081/path?params`
- **跨平台一致**：无论 Web 端还是 App 端都生成相同的链接

#### 扫码行为

- **App 扫码**：如果 App 支持深度链接，直接打开对应功能页面
- **浏览器扫码**：在浏览器中打开网站页面，页面会提示用户下载 App
- **智能引导**：根据扫码设备自动选择最佳体验

### 通用模式 (useWebsiteMode={false})

#### App 扫码

- 如果 App 已安装，直接打开对应页面
- 使用深度链接：`kuairongbei://app/path`

#### 浏览器扫码

- 如果 App 未安装，引导下载 App
- 如果 App 已安装，直接打开 App
- 使用通用链接：`https://kuairongbei.com/path`

#### Web 端

- 直接打开对应的 Web 页面
- 使用相对路径：`/path`

## 二维码扫描

### 扫描功能

二维码扫描功能支持多种格式的二维码识别和解析：

#### 支持的二维码格式

- **Web 链接**：`https://192.168.1.4:8081/path?params`
- **相对路径**：`/path?params`
- **通用链接**：`https://kuairongbei.com/path?params`

#### 扫描行为

- **App 端扫描**：解析二维码内容，直接跳转到对应功能页面
- **Web 端扫描**：解析二维码内容，在浏览器中打开对应页面
- **智能识别**：自动识别二维码类型和内容
- **参数传递**：支持查询参数的解析和传递

#### 使用场景

- **功能跳转**：扫描二维码直接进入对应功能
- **参数传递**：通过二维码传递用户 ID、页面参数等
- **跨平台分享**：一个二维码适用于所有平台
- **用户引导**：引导用户下载 App 或访问 Web 页面

## 注意事项

1. **路径格式**：路径应以 `/` 开头
2. **参数类型**：参数会被转换为字符串
3. **错误处理**：生成失败时会显示错误信息和重试按钮
4. **性能优化**：二维码会缓存，避免重复生成
5. **平台兼容**：支持 Web 和移动端

## 示例场景

### 1. 用户分享个人资料

```typescript
<QRCodeDisplay
  path="/user/profile"
  params={{ id: user.id }}
  title="我的资料"
  description="扫码查看我的个人资料"
/>
```

### 2. 商品详情分享

```typescript
<QRCodeDisplay
  path="/product/detail"
  params={{ id: product.id, source: "qrcode" }}
  title="商品详情"
  description="扫码查看商品详情"
/>
```

### 3. 活动页面分享

```typescript
<QRCodeDisplay
  path="/activity"
  params={{ id: activity.id, inviteCode: user.inviteCode }}
  title="活动页面"
  description="扫码参与活动"
/>
```

## 技术实现

- 使用 `react-native-qrcode-svg` 库生成二维码
- 支持 Web 和 App 双端渲染
- 自动处理深度链接和 Web 链接
- 支持自定义二维码样式和 Logo
- 支持渐变效果和高级配置
