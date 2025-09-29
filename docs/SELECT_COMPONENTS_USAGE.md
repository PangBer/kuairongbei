# 下拉选择组件使用说明

## 概述

本文档介绍快融呗应用中跨平台的下拉选择组件和多级选择组件的使用方法和功能特性。组件使用条件渲染技术，为不同平台提供最适合的用户体验：

- **移动端 (iOS/Android)**: 使用 `@react-native-picker/picker` 提供原生选择器体验
- **Web 端**: 使用自定义 Modal 和 TouchableOpacity 提供 Web 友好的下拉选择体验

## 组件列表

### 1. SelectDropdown - 普通下拉选择组件

用于简单的单选下拉选择，适用于性别、职业、芝麻分等字典数据选择。

### 2. MultiLevelSelect - 多级选择组件

用于多级选择，支持任意层级的选择，具有面包屑导航和快速返回功能。可以用于城市选择、分类选择等场景。

## SelectDropdown 组件

### 功能特性

- ✅ 跨平台支持 (移动端原生 Picker + Web 端自定义下拉)
- ✅ 支持禁用状态
- ✅ 错误状态显示
- ✅ 自定义占位符
- ✅ 选中状态高亮显示
- ✅ 平台适配的用户体验

### 使用方法

```typescript
import SelectDropdown from "@/components/SelectDropdown";

// 基本使用
<SelectDropdown
  label="性别"
  value={selectedValue}
  options={[
    { label: "男", value: "1" },
    { label: "女", value: "2" },
  ]}
  onSelect={(value) => setSelectedValue(value)}
  placeholder="请选择性别"
  error={hasError}
/>;
```

### Props 接口

```typescript
interface SelectDropdownProps {
  label: string; // 标签文本
  value?: string; // 当前选中的值
  options: SelectOption[]; // 选项数组
  onSelect: (value: string) => void; // 选择回调
  placeholder?: string; // 占位符文本
  disabled?: boolean; // 是否禁用
  error?: boolean; // 是否显示错误状态
}

interface SelectOption {
  label: string; // 显示文本
  value: string; // 选项值
}
```

## MultiLevelSelect 组件

### MultiLevelSelect 功能特性

- ✅ 跨平台支持 (统一 TextInput 触发器 + Modal 多级选择)
- ✅ 多级选择（Web 端和移动端都支持任意层级）
- ✅ 统一 TextInput 触发器（与 SelectDropdown 一致）
- ✅ 面包屑导航（跨平台）
- ✅ 自动显示下级选项（跨平台）
- ✅ 支持禁用状态
- ✅ 错误状态显示
- ✅ 可配置最大层级数（跨平台）
- ✅ 可自定义每层标签（跨平台）

### MultiLevelSelect 使用方法

```typescript
import MultiLevelSelect from "@/components/MultiLevelSelect";

// 基本使用（城市选择）
// 注意：Web端和移动端都支持多级选择，使用统一的TextInput触发器
<MultiLevelSelect
  label="贷款地"
  value={selectedCityId}
  options={cityData} // 城市数据，支持嵌套结构
  onSelect={(cityId, fullPath) => {
    setSelectedCityId(cityId);
    console.log("选择的城市路径:", fullPath);
  }}
  placeholder="请选择城市"
  error={hasError}
  maxLevels={3} // 跨平台有效
  levelLabels={["省份", "城市", "区县"]} // 跨平台有效
/>;

// 分类选择示例
<MultiLevelSelect
  label="商品分类"
  value={selectedCategoryId}
  options={categoryData}
  onSelect={(categoryId, fullPath) => {
    setSelectedCategoryId(categoryId);
  }}
  placeholder="请选择分类"
  maxLevels={2} // 跨平台有效
  levelLabels={["一级分类", "二级分类"]} // 跨平台有效
/>;
```

### MultiLevelSelect Props 接口

```typescript
interface MultiLevelSelectProps {
  label: string; // 标签文本
  value?: string; // 当前选中的值
  options: SelectOption[]; // 数据数组
  onSelect: (value: string, fullPath: string) => void; // 选择回调
  placeholder?: string; // 占位符文本
  disabled?: boolean; // 是否禁用
  error?: boolean; // 是否显示错误状态
  maxLevels?: number; // 最大层级数，默认为3（跨平台有效）
  levelLabels?: string[]; // 每层的标签，如["省份", "城市", "区县"]（跨平台有效）
}

interface SelectOption {
  id?: string; // 选项ID
  name?: string; // 选项名称
  dictCode?: string; // 字典代码（兼容字典数据）
  dictLabel?: string; // 字典标签（兼容字典数据）
  children?: SelectOption[]; // 子级选项
  [key: string]: any; // 其他属性
}
```

### 城市数据结构示例

```typescript
const cityData = [
  {
    id: "110000",
    name: "北京市",
    children: [
      {
        id: "110100",
        name: "北京市",
        children: [
          { id: "110101", name: "东城区" },
          { id: "110102", name: "西城区" },
          // ... 更多区县
        ],
      },
    ],
  },
  {
    id: "120000",
    name: "天津市",
    children: [
      // ... 天津的市区
    ],
  },
  // ... 更多省份
];
```

## 在 Gather 表单中的集成

### 自动识别选择类型

Gather 表单会根据配置自动选择合适的组件：

```typescript
// 渲染选择框
const renderSelect = (option: any) => {
  const fieldName = option.prop as keyof FormData;
  const dictData = dicts[option.dict] || [];

  // 如果是城市选择，使用多级选择组件
  if (option.dict === "citys_collect") {
    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        render={({ field: { onChange, value } }) => (
          <MultiLevelSelect
            label={option.label}
            value={value as string}
            options={dictData}
            onSelect={(cityId, fullPath) => {
              onChange(cityId);
              console.log("选择的城市:", fullPath);
            }}
            placeholder="请选择城市"
            error={!!errors[fieldName]}
            maxLevels={3}
            levelLabels={["省份", "城市", "区县"]}
          />
        )}
      />
    );
  }

  // 普通下拉选择
  const selectOptions = dictData.map((item: any) => ({
    label: item.dictLabel,
    value: item.dictCode,
  }));

  return (
    <Controller
      key={fieldName}
      control={control}
      name={fieldName}
      render={({ field: { onChange, value } }) => (
        <SelectDropdown
          label={option.label}
          value={value as string}
          options={selectOptions}
          onSelect={onChange}
          placeholder="请选择"
          error={!!errors[fieldName]}
        />
      )}
    />
  );
};
```

### 配置示例

在 `_rules.ts` 中的配置：

```typescript
// 普通选择框
{
  label: '性别',
  prop: 'sex',
  type: 'select',
  dict: 'sys_user_sex'
}

// 城市选择框
{
  label: '贷款地',
  prop: 'city',
  type: 'select',
  dict: 'citys_collect',
  props: {
    text: 'name',
    value: 'id',
    children: 'children'
  }
}
```

## 样式定制

### 主题颜色

组件使用项目主题色和原生样式：

```typescript
const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  errorContainer: {
    borderColor: "#F44336",
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
    color: "#333",
  },
});
```

### 响应式设计

- 支持不同屏幕尺寸
- 原生滚动体验
- 自适应高度

## 最佳实践

### 1. 数据格式

- 确保选项数据格式正确
- 城市数据需要嵌套结构
- 字典数据需要 `dictLabel` 和 `dictCode` 字段

### 2. 用户体验

- 提供清晰的占位符文本
- 使用合适的标签描述
- 及时显示错误状态

### 3. 性能优化

- 原生 Picker 性能优异
- 级联选择减少数据加载
- 避免过深的嵌套层级

### 4. 错误处理

- 验证选择是否有效
- 提供错误提示
- 支持重置选择

## 跨平台实现

### 平台检测

组件使用 `Platform.OS` 来检测当前运行平台：

```typescript
import { Platform } from "react-native";

// 平台检测
if (Platform.OS === "web") {
  // Web 端实现
  return <WebImplementation />;
} else {
  // 移动端实现
  return <MobileImplementation />;
}
```

### 移动端实现

- **iOS/Android**: 使用统一的 TextInput 触发器 + Modal 多级选择
- **特性**: 与 Web 端一致的用户体验、多级选择、面包屑导航

### Web 端实现

- **选择器**: 使用统一的 TextInput 触发器 + Modal 多级选择
- **多级选择**: 面包屑导航 + 级联选择
- **特性**: 与移动端一致的用户体验、鼠标交互、选中状态高亮

### 样式适配

```typescript
const styles = StyleSheet.create({
  // 移动端样式
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  // Web 端样式
  webButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 8,
  },
});
```

## 注意事项

1. **数据兼容性**: MultiLevelSelect 组件兼容字典数据格式，支持 `dictCode`/`dictLabel` 和 `id`/`name` 两种格式
2. **平台一致性**:
   - **移动端和 Web 端**: 都支持多级选择，使用相同的 TextInput 触发器
   - **建议**: 多级选择不超过 3-4 级，避免过深的嵌套
3. **跨平台体验**: 不同平台提供最适合的用户交互方式
4. **样式一致性**: 组件样式与应用主题保持一致
5. **Web 兼容性**: Web 端使用自定义 Modal 实现，确保良好的 Web 体验
6. **选中状态**: Web 端会高亮显示当前选中的选项，提供更好的用户体验
7. **重复选择**: 已移除重复选择逻辑，确保选择操作的唯一性

## 故障排除

### 常见问题

1. **选项不显示**

   - 检查数据格式是否正确
   - 确认 `options` 数组不为空

2. **选择不生效**

   - 检查 `onSelect` 回调是否正确
   - 确认值类型匹配

3. **样式显示异常**

   - 检查主题配置
   - 确认样式表正确导入

4. **多级选择卡顿**

   - 检查数据量是否过大
   - 移动端和 Web 端都使用 Modal 实现，性能良好
   - 建议多级选择不超过 3-4 级

5. **Web 端显示异常**

   - 检查 Web 端样式是否正确应用
   - 验证 Platform.OS 检测是否正常
   - 确认 Modal 组件正确渲染

6. **选中状态不显示**

   - 检查 value 属性是否正确传递
   - 确认选项数据结构正确
   - 验证 onSelect 回调是否正常工作

7. **移动端多级选择不工作**
   - 移动端现在支持多级选择，与 Web 端功能一致
   - 确保数据格式正确，支持嵌套的 children 结构
   - 检查 maxLevels 和 levelLabels 配置是否正确
