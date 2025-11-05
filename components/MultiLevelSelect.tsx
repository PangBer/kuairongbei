import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { useSelectModal } from "./hooks/useSelectModal";
import { selectStyles } from "./styles/selectStyles";
import { ThemedText, ThemedView } from "./ui";
import { buildOptionPath, getPathDisplayText } from "./utils/selectUtils";
/**
 * 选择选项接口
 */
interface SelectOption {
  id?: string;
  name?: string;
  dictCode?: string;
  dictLabel?: string;
  value?: string;
  dictValue?: string;
  children?: SelectOption[];
  [key: string]: any;
}

/**
 * 多级选择组件属性
 */
interface MultiLevelSelectProps {
  label: string; // 标签文本
  value?: string; // 当前选中的值
  options: SelectOption[] | any[]; // 选项数据（支持多级结构）
  onSelect: (value: string, fullPath: string) => void; // 选择回调
  placeholder?: string; // 占位符文本
  disabled?: boolean; // 是否禁用
  error?: boolean; // 是否显示错误状态
  errorMessage?: string; // 错误提示信息
  required?: boolean; // 是否必填
  maxLevels?: number; // 最大层级数，默认为3
  showClear?: boolean; // 是否显示清除按钮，默认为 true
}

/**
 * 多级选择组件
 * 支持多级联动选择，通过面包屑导航展示层级结构
 */
export default function MultiLevelSelect({
  label,
  value,
  options,
  onSelect,
  placeholder = "请选择",
  disabled = false,
  error = false,
  errorMessage,
  required = false,
  maxLevels = 3,
  showClear = true,
}: MultiLevelSelectProps) {
  // 弹窗状态管理
  const { visible, showModal, hideModal } = useSelectModal();

  // 选择状态
  const [currentLevel, setCurrentLevel] = useState(0); // 当前层级
  const [selectedPath, setSelectedPath] = useState<SelectOption[]>([]); // 已选择的路径
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>(options); // 当前层级的选项
  const [selectedValue, setSelectedValue] = useState<string>(""); // 选中的值
  const [displayValue, setDisplayValue] = useState<string>(""); // 显示的文本

  // 滚动视图引用
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * 滚动到列表顶部
   */
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  /**
   * 初始化选中状态
   * @param targetValue - 目标值
   */
  const initializeSelection = (targetValue: string) => {
    const path = buildOptionPath(options, targetValue);
    setSelectedValue(targetValue);

    if (path.length > 0) {
      setSelectedPath(path);
      setDisplayValue(getPathDisplayText(path));

      const lastOption = path[path.length - 1];

      // 如果有子级，显示子级选项；否则显示父级的子级选项
      if (lastOption.children?.length) {
        setCurrentLevel(path.length);
        setCurrentOptions(lastOption.children);
      } else {
        setCurrentLevel(path.length - 1);
        if (path.length > 1) {
          const parentOption = path[path.length - 2];
          setCurrentOptions(parentOption.children || []);
        } else {
          setCurrentOptions(options);
        }
      }
    }
  };

  /**
   * 根据 value 初始化选中状态
   */
  useEffect(() => {
    if (value && options.length > 0) {
      initializeSelection(value);
    } else {
      // 重置状态
      setSelectedPath([]);
      setDisplayValue("");
      setCurrentLevel(0);
      setCurrentOptions(options);
    }
  }, [value, options]);

  /**
   * 当弹窗显示时，重新初始化选中状态
   */
  useEffect(() => {
    if (visible && value && options.length > 0) {
      initializeSelection(value);
    } else if (visible) {
      // 如果没有 value，重置到初始状态
      setCurrentLevel(0);
      setSelectedPath([]);
      setCurrentOptions(options);
    }
  }, [visible]);

  /**
   * 处理选项选择
   * @param option - 选中的选项
   */
  const handleOptionSelect = (option: SelectOption) => {
    const newPath = [...selectedPath.slice(0, currentLevel), option];
    setSelectedPath(newPath);

    // 如果有子级且未达到最大层级，继续进入下一级
    if (option.children?.length && currentLevel < maxLevels - 1) {
      setCurrentLevel(currentLevel + 1);
      setCurrentOptions(option.children);
      setTimeout(() => scrollToTop(), 100);
    } else {
      // 选择完成，触发回调
      const fullPath = newPath
        .map((opt) => opt.name || opt.dictLabel)
        .join(" - ");
      setDisplayValue(fullPath);

      onSelect(option.value || option.dictValue || "", fullPath);
      hideModal();

      // 延迟重置状态，等待弹窗关闭动画完成
      setTimeout(() => {
        setCurrentLevel(0);
        setSelectedPath([]);
        setCurrentOptions(options);
      }, 300);
    }
  };

  /**
   * 返回上一级
   */
  const goBack = () => {
    if (currentLevel > 0) {
      const newLevel = currentLevel - 1;
      setCurrentLevel(newLevel);
      const newPath = selectedPath.slice(0, newLevel);
      setSelectedPath(newPath);

      // 根据新的路径设置当前选项
      if (newLevel === 0) {
        setCurrentOptions(options);
      } else {
        const parentOption = newPath[newLevel - 1];
        setCurrentOptions(parentOption?.children || []);
      }

      setTimeout(() => scrollToTop(), 100);
    }
  };

  /**
   * 处理面包屑导航点击
   * @param index - 面包屑索引
   */
  const handleBreadcrumbClick = (index: number) => {
    const newPath = selectedPath.slice(0, index + 1);
    setSelectedPath(newPath);
    setCurrentLevel(index + 1);

    // 根据点击的面包屑项设置当前选项
    if (index === 0) {
      setCurrentOptions(options);
    } else {
      const parentOption = newPath[index - 1];
      setCurrentOptions(parentOption?.children || []);
    }

    setTimeout(() => scrollToTop(), 100);
  };

  /**
   * 处理清除选项
   */
  const handleClear = () => {
    onSelect("", "");
    hideModal();
    // 重置状态
    setTimeout(() => {
      setCurrentLevel(0);
      setSelectedPath([]);
      setCurrentOptions(options);
      setDisplayValue("");
      setSelectedValue("");
    }, 300);
  };

  return (
    <>
      {/* 输入框（显示选中值） */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => !disabled && showModal()}
      >
        <TextInput
          label={label + (required ? " *" : "")}
          value={displayValue}
          placeholder={placeholder}
          editable={false}
          disabled={disabled}
          mode="outlined"
          error={!!error}
          right={
            <TextInput.Icon
              icon="chevron-down"
              onPress={() => !disabled && showModal()}
              forceTextInputFocus={false}
            />
          }
        />
        <HelperText type="error" visible={!!error}>
          {errorMessage as string}
        </HelperText>
      </TouchableOpacity>

      {/* 选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={hideModal}
      >
        <View style={selectStyles.modalOverlay}>
          <TouchableOpacity
            style={selectStyles.modalOverlayTouchable}
            onPress={hideModal}
            activeOpacity={1}
          />
          <ThemedView style={selectStyles.modalContent}>
            <View style={selectStyles.modalHeader}>
              <View style={selectStyles.modalHeaderLeft}>
                {showClear && (
                  <TouchableOpacity onPress={handleClear}>
                    <ThemedText style={selectStyles.modalClearText}>
                      清除
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
              <View style={selectStyles.modalTitleContainer}>
                {/* 面包屑导航 */}
                {currentLevel > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={selectStyles.breadcrumb}>
                      {selectedPath
                        .slice(0, currentLevel)
                        .map((option, index) => (
                          <View key={option.id || option.dictCode || index}>
                            <TouchableOpacity
                              onPress={() => handleBreadcrumbClick(index)}
                            >
                              <ThemedText style={selectStyles.breadcrumbText}>
                                {option.name || option.dictLabel}
                              </ThemedText>
                            </TouchableOpacity>
                            {index < currentLevel - 1 && (
                              <ThemedText
                                style={selectStyles.breadcrumbSeparator}
                              >
                                &gt;
                              </ThemedText>
                            )}
                          </View>
                        ))}
                    </View>
                  </ScrollView>
                ) : (
                  <ThemedText style={selectStyles.modalTitle}>
                    {label}
                  </ThemedText>
                )}
              </View>
              <View style={selectStyles.modalHeaderRight}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  {currentLevel > 0 && (
                    <TouchableOpacity onPress={goBack}>
                      <ThemedText style={selectStyles.modalCloseText}>
                        上一级
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={hideModal}>
                    <ThemedText style={selectStyles.modalCloseText}>
                      关闭
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 选项列表 */}
            <ScrollView ref={scrollViewRef} style={selectStyles.modalOptions}>
              {currentOptions.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <TouchableOpacity
                    key={option.id || option.dictCode || option.value}
                    style={selectStyles.modalOptionItem}
                    onPress={() => handleOptionSelect(option)}
                    activeOpacity={1}
                  >
                    <ThemedText
                      style={[
                        selectStyles.modalOptionText,
                        isSelected && selectStyles.modalOptionTextActive,
                      ]}
                    >
                      {option.name || option.dictLabel}
                    </ThemedText>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {/* 如果有子级，显示右箭头 */}
                      {option.children?.length && (
                        <AntDesign name="right" size={16} color="#4a9aff" />
                      )}
                      {/* 选中标记 */}
                      {isSelected && (
                        <ThemedText style={selectStyles.modalCheckmark}>
                          ✓
                        </ThemedText>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}
