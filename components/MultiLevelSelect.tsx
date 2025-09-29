import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  TextInput,
  Text as TextPaper,
} from "react-native-paper";
import { useSelectModal } from "./hooks/useSelectModal";
import { selectStyles } from "./styles/selectStyles";
import {
  buildOptionPath,
  getParentOptions,
  getPathDisplayText,
} from "./utils/selectUtils";

interface SelectOption {
  id?: string;
  name?: string;
  dictCode?: string;
  dictLabel?: string;
  children?: SelectOption[];
  [key: string]: any;
}

interface MultiLevelSelectProps {
  label: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string, fullPath: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  maxLevels?: number; // 最大层级数，默认为3
}

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
}: MultiLevelSelectProps) {
  const { visible, showModal, hideModal } = useSelectModal();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedPath, setSelectedPath] = useState<SelectOption[]>([]);
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>(options);
  const [displayValue, setDisplayValue] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  // 滚动到顶部
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // 根据value初始化选中状态
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

  // 初始化选中状态
  const initializeSelection = (targetValue: string) => {
    const path = buildOptionPath(options, targetValue);
    if (path.length > 0) {
      setSelectedPath(path);
      setCurrentLevel(path.length - 1);
      setDisplayValue(getPathDisplayText(path));
      const lastOption = path[path.length - 1];
      setCurrentOptions(lastOption?.children || []);
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    const newPath = [...selectedPath.slice(0, currentLevel), option];
    setSelectedPath(newPath);

    if (option.children?.length && currentLevel < maxLevels - 1) {
      setCurrentLevel(currentLevel + 1);
      setCurrentOptions(option.children);
      // 滚动到顶部
      setTimeout(() => scrollToTop(), 100);
    } else {
      // 选择完成
      const fullPath = newPath
        .map((opt) => opt.label || opt.dictLabel)
        .join(" - ");
      setDisplayValue(fullPath);

      onSelect(option.value || option.dictValue, fullPath);
      hideModal();
      setCurrentLevel(0);
      setSelectedPath([]);
      setCurrentOptions(options);
    }
  };

  const goBack = () => {
    if (currentLevel > 0) {
      const newLevel = currentLevel - 1;
      setCurrentLevel(newLevel);
      const newPath = selectedPath.slice(0, newLevel);
      setSelectedPath(newPath);
      setCurrentOptions(getParentOptions(options, newPath));
      // 滚动到顶部
      setTimeout(() => scrollToTop(), 100);
    }
  };

  const resetSelection = () => {
    setCurrentLevel(0);
    setSelectedPath([]);
    setCurrentOptions(options);
    setDisplayValue("");
  };

  return (
    <View style={selectStyles.container}>
      <TouchableOpacity onPress={() => !disabled && showModal()}>
        <TextInput
          label={label + (required ? " *" : "")}
          value={displayValue}
          placeholder={placeholder}
          editable={false}
          disabled={disabled}
          mode="outlined"
          error={!!error}
          right={<TextInput.Icon icon="chevron-down" />}
          style={selectStyles.textInput}
        />
        <HelperText type="error" visible={!!error}>
          {errorMessage as string}
        </HelperText>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hideModal}
      >
        <TouchableOpacity style={selectStyles.modalOverlay} onPress={hideModal}>
          <View style={selectStyles.modalContent}>
            {/* 面包屑导航 */}
            {currentLevel > 0 && (
              <>
                <View style={selectStyles.breadcrumbContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={selectStyles.breadcrumb}>
                      {selectedPath
                        .slice(0, currentLevel)
                        .map((option, index) => (
                          <React.Fragment
                            key={option.id || option.dictCode || index}
                          >
                            <TouchableOpacity
                              style={selectStyles.breadcrumbItem}
                              onPress={() => {
                                const newPath = selectedPath.slice(
                                  0,
                                  index + 1
                                );
                                setSelectedPath(newPath);
                                setCurrentLevel(index + 1);

                                if (index === 0) {
                                  setCurrentOptions(options);
                                } else {
                                  let parentOptions = options;
                                  for (let i = 0; i < index; i++) {
                                    const parent = parentOptions.find(
                                      (opt) =>
                                        (opt.id || opt.dictCode) ===
                                        (selectedPath[i].id ||
                                          selectedPath[i].dictCode)
                                    );
                                    if (parent?.children) {
                                      parentOptions = parent.children;
                                    }
                                  }
                                  setCurrentOptions(parentOptions);
                                }
                                // 滚动到顶部
                                setTimeout(() => scrollToTop(), 100);
                              }}
                            >
                              <TextPaper style={selectStyles.breadcrumbText}>
                                {option.name || option.dictLabel}
                              </TextPaper>
                            </TouchableOpacity>
                            {index < currentLevel - 1 && (
                              <TextPaper
                                style={selectStyles.breadcrumbSeparator}
                              >
                                &gt;
                              </TextPaper>
                            )}
                          </React.Fragment>
                        ))}
                    </View>
                  </ScrollView>
                </View>
                <Divider />
              </>
            )}

            {/* 操作按钮 */}
            <View style={selectStyles.actionContainer}>
              {currentLevel > 0 && (
                <Button
                  mode="text"
                  onPress={goBack}
                  compact
                  style={selectStyles.actionButton}
                >
                  返回上级
                </Button>
              )}
              <Button
                mode="text"
                onPress={resetSelection}
                compact
                style={selectStyles.actionButton}
              >
                重新选择
              </Button>
            </View>

            {currentLevel > 0 && <Divider />}

            {/* 选项列表 */}
            <ScrollView ref={scrollViewRef} style={selectStyles.optionsList}>
              {currentOptions.map((option, index) => (
                <React.Fragment key={option.id || option.dictCode || index}>
                  <TouchableOpacity
                    style={selectStyles.optionItem}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <View style={selectStyles.optionText}>
                      <TextPaper>{option.name || option.dictLabel}</TextPaper>
                      {option.children?.length && (
                        <AntDesign name="right" size={16} color="darkgray" />
                      )}
                    </View>
                  </TouchableOpacity>
                  {index < currentOptions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
