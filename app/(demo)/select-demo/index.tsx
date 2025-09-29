import MultiLevelSelect from "@/components/MultiLevelSelect";
import SelectDropdown from "@/components/SelectDropdown";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function SelectDemoScreen() {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 性别选项
  const genderOptions = [
    { label: "男", value: "1" },
    { label: "女", value: "2" },
  ];

  // 城市数据（模拟数据）
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
            { id: "110105", name: "朝阳区" },
            { id: "110106", name: "丰台区" },
          ],
        },
      ],
    },
    {
      id: "120000",
      name: "天津市",
      children: [
        {
          id: "120100",
          name: "天津市",
          children: [
            { id: "120101", name: "和平区" },
            { id: "120102", name: "河东区" },
            { id: "120103", name: "河西区" },
          ],
        },
      ],
    },
    {
      id: "310000",
      name: "上海市",
      children: [
        {
          id: "310100",
          name: "上海市",
          children: [
            { id: "310101", name: "黄浦区" },
            { id: "310104", name: "徐汇区" },
            { id: "310105", name: "长宁区" },
          ],
        },
      ],
    },
  ];

  // 商品分类数据（模拟数据）
  const categoryData = [
    {
      id: "1",
      name: "电子产品",
      children: [
        { id: "11", name: "手机" },
        { id: "12", name: "电脑" },
        { id: "13", name: "平板" },
      ],
    },
    {
      id: "2",
      name: "服装鞋帽",
      children: [
        { id: "21", name: "男装" },
        { id: "22", name: "女装" },
        { id: "23", name: "童装" },
      ],
    },
    {
      id: "3",
      name: "家居用品",
      children: [
        { id: "31", name: "家具" },
        { id: "32", name: "家电" },
        { id: "33", name: "装饰" },
      ],
    },
  ];

  const handleSubmit = () => {
    const results = {
      性别: selectedGender
        ? genderOptions.find((g) => g.value === selectedGender)?.label
        : "未选择",
      城市: selectedCity || "未选择",
      分类: selectedCategory || "未选择",
    };

    Alert.alert("选择结果", JSON.stringify(results, null, 2));
  };

  const handleReset = () => {
    setSelectedGender("");
    setSelectedCity("");
    setSelectedCategory("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>选择器组件演示</Text>
      <Text style={styles.description}>
        演示跨平台选择器组件的功能，包括普通下拉选择和多级选择
      </Text>

      {/* 普通下拉选择演示 */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>普通下拉选择</Text>
          <Text style={styles.cardDescription}>
            适用于简单的单选场景，如性别、状态等
          </Text>

          <SelectDropdown
            label="性别"
            value={selectedGender}
            options={genderOptions}
            onSelect={setSelectedGender}
            placeholder="请选择性别"
            error={false}
            required={true}
          />
        </Card.Content>
      </Card>

      {/* 多级选择演示 - 城市 */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>多级选择 - 城市选择</Text>
          <Text style={styles.cardDescription}>
            支持省-市-区三级选择，具有面包屑导航功能
          </Text>

          <MultiLevelSelect
            label="所在城市"
            value={selectedCity}
            options={cityData}
            onSelect={(cityId, fullPath) => {
              setSelectedCity(cityId);
              console.log("选择的城市:", fullPath);
            }}
            placeholder="请选择城市"
            error={false}
            required={true}
            maxLevels={3}
            levelLabels={["省份", "城市", "区县"]}
          />
        </Card.Content>
      </Card>

      {/* 多级选择演示 - 分类 */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>多级选择 - 商品分类</Text>
          <Text style={styles.cardDescription}>
            支持任意层级的选择，可配置最大层级数
          </Text>

          <MultiLevelSelect
            label="商品分类"
            value={selectedCategory}
            options={categoryData}
            onSelect={(categoryId, fullPath) => {
              setSelectedCategory(categoryId);
              console.log("选择的分类:", fullPath);
            }}
            placeholder="请选择分类"
            error={false}
            required={false}
            maxLevels={2}
            levelLabels={["一级分类", "二级分类"]}
          />
        </Card.Content>
      </Card>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          查看选择结果
        </Button>
        <Button
          mode="outlined"
          onPress={handleReset}
          style={styles.resetButton}
        >
          重置选择
        </Button>
      </View>

      {/* 功能说明 */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <Text style={styles.helpTitle}>功能说明</Text>
          <Text style={styles.helpText}>
            <Text style={styles.helpSection}>普通下拉选择：</Text>
            {"\n"}• 适用于简单的单选场景{"\n"}• 支持禁用状态和错误显示{"\n"}•
            Web端显示选中状态高亮{"\n\n"}
            <Text style={styles.helpSection}>多级选择：</Text>
            {"\n"}• 支持任意层级的选择{"\n"}• 可配置最大层级数和每层标签{"\n"}•
            Web端具有面包屑导航功能{"\n"}• 移动端使用级联选择器{"\n\n"}
            <Text style={styles.helpSection}>跨平台特性：</Text>
            {"\n"}• 移动端使用原生Picker组件{"\n"}• Web端使用自定义Modal实现
            {"\n"}• 自动适配不同平台的交互方式
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 24,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    flex: 1,
    marginLeft: 8,
  },
  helpCard: {
    marginTop: 16,
    backgroundColor: "#f8f9fa",
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  helpSection: {
    fontWeight: "600",
    color: "#333",
  },
});
