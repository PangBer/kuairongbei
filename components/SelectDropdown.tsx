import React, { useMemo } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { useSelectModal } from "./hooks/useSelectModal";
import globalStyles from "./styles/globalStyles";
import { selectStyles } from "./styles/selectStyles";
import { ThemedText, ThemedView } from "./ui";

/**
 * 下拉选择选项接口
 */
interface SelectOption {
  label: string; // 显示文本
  value: string; // 选项值
}

/**
 * 下拉选择组件属性
 */
interface SelectDropdownProps {
  label: string; // 标签文本
  value?: string; // 当前选中的值
  options: SelectOption[]; // 选项列表
  onSelect: (value: string) => void; // 选择回调
  placeholder?: string; // 占位符文本
  disabled?: boolean; // 是否禁用
  error?: boolean; // 是否显示错误状态
  errorMessage?: string; // 错误提示信息
  required?: boolean; // 是否必填
  showClear?: boolean; // 是否显示清除按钮，默认为 true
}

/**
 * 下拉选择组件
 * 提供单选下拉列表功能，支持错误提示和禁用状态
 */
export default function SelectDropdown({
  label,
  value,
  options = [],
  onSelect,
  placeholder = "请选择",
  disabled = false,
  error = false,
  errorMessage,
  required = false,
  showClear = true,
}: SelectDropdownProps) {
  // 弹窗状态管理
  const { visible, showModal, hideModal } = useSelectModal();

  // 查找当前选中的选项
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [value, options]
  );

  /**
   * 处理选项选择
   * @param optionValue - 选中的选项值
   */
  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    hideModal();
  };

  /**
   * 处理清除选项
   */
  const handleClear = () => {
    onSelect("");
    hideModal();
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
          value={selectedOption ? selectedOption.label : ""}
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
                <ThemedText style={selectStyles.modalTitle}>{label}</ThemedText>
              </View>
              <View style={selectStyles.modalHeaderRight}>
                <TouchableOpacity onPress={hideModal}>
                  <ThemedText style={selectStyles.modalCloseText}>
                    关闭
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              style={selectStyles.modalOptions}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={globalStyles.globalPaddingBottom}
            >
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={selectStyles.modalOptionItem}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={1}
                  >
                    <ThemedText
                      style={[
                        selectStyles.modalOptionText,
                        isSelected && selectStyles.modalOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                    {/* 选中标记 */}
                    {isSelected && (
                      <ThemedText style={selectStyles.modalCheckmark}>
                        ✓
                      </ThemedText>
                    )}
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
