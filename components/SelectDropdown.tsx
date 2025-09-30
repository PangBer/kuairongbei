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

interface SelectOption {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  label: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

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
  const { visible, showModal, hideModal } = useSelectModal();
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    hideModal();
  };

  return (
    <>
      <TouchableOpacity onPress={() => !disabled && showModal()}>
        <TextInput
          label={label + (required ? " *" : "")}
          value={selectedOption ? selectedOption.label : ""}
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
            <ScrollView style={selectStyles.optionsList}>
              {options.map((option, index) => {
                const isSelected = value === option.value;
                return (
                  <React.Fragment key={option.value}>
                    <TouchableOpacity
                      style={[
                        selectStyles.optionItem,
                        isSelected && selectStyles.selectedOptionItem,
                      ]}
                      onPress={() => handleSelect(option.value)}
                    >
                      <TextPaper
                        style={[
                          selectStyles.optionText,
                          isSelected && selectStyles.selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </TextPaper>
                      {isSelected && (
                        <TextPaper style={selectStyles.checkmark}>✓</TextPaper>
                      )}
                    </TouchableOpacity>
                    {index < options.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
