import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Divider,
  HelperText,
  TextInput,
  Text as TextPaper,
} from "react-native-paper";
import { useSelectModal } from "./hooks/useSelectModal";
import { selectStyles } from "./styles/selectStyles";
import { ThemedCard } from "./ui";

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
}

/**
 * 下拉选择组件
 * 提供单选下拉列表功能，支持错误提示和禁用状态
 */
export default function SelectDropdown({
  label,
  value,
  options,
  onSelect,
  placeholder = "请选择",
  disabled = false,
  error = false,
  errorMessage,
  required = false,
}: SelectDropdownProps) {
  // 弹窗状态管理
  const { visible, showModal, hideModal } = useSelectModal();

  // 查找当前选中的选项
  const selectedOption = options.find((option) => option.value === value);

  /**
   * 处理选项选择
   * @param optionValue - 选中的选项值
   */
  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
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
        animationType="none"
        onRequestClose={hideModal}
      >
        <TouchableOpacity
          style={selectStyles.modalOverlay}
          onPress={hideModal}
          activeOpacity={1}
        >
          <ThemedCard style={selectStyles.modalContent}>
            <ScrollView style={selectStyles.optionsList}>
              {options.map((option, index) => {
                const isSelected = value === option.value;
                return (
                  <View key={option.value}>
                    <TouchableOpacity
                      style={selectStyles.optionItem}
                      onPress={() => handleSelect(option.value)}
                      activeOpacity={1}
                    >
                      <TextPaper
                        style={[
                          selectStyles.optionText,
                          isSelected && selectStyles.selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </TextPaper>
                      {/* 选中标记 */}
                      {isSelected && (
                        <TextPaper style={selectStyles.checkmark}>✓</TextPaper>
                      )}
                    </TouchableOpacity>
                    {index < options.length - 1 && <Divider />}
                  </View>
                );
              })}
            </ScrollView>
          </ThemedCard>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
