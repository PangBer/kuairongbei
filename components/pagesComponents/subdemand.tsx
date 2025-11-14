import { Control, useController } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import FileUpload from "../FileUpload";
import LevelSelect from "../LevelSelect";
import SelectDropdown from "../SelectDropdown";
import { ThemedText } from "../ui";

export function RenderTextInput({
  control,
  label,
  prop,
  required,
  rules,
  type = "default",
  score,
  setScore,
  disabled,
}: {
  control: Control;
  label: string;
  prop: string;
  required?: boolean;
  rules?: any;
  type?: "numeric" | "default";
  score?: number;
  setScore?: () => void;
  disabled?: boolean;
}) {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    control,
    name: prop,
    rules,
  });

  return (
    <View style={styles.controllerContainer}>
      <>
        <TextInput
          label={`${label} ${required ? "*" : ""}`}
          value={value as string}
          onChangeText={onChange}
          onBlur={() => {
            onBlur();
            if (setScore) {
              setScore();
            }
          }}
          disabled={disabled}
          mode="outlined"
          keyboardType={type}
          error={!!error}
        />
        <HelperText type="error" visible={!!error}>
          {error?.message as string}
        </HelperText>
      </>

      {score ? (
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.scoreText}>+{score}积分</ThemedText>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

export function RenderSelect({
  control,
  label,
  prop,
  required,
  rules,
  options,
  score,
  setScore,
  disabled,
}: {
  control: Control;
  label: string;
  prop: string;
  required?: boolean;
  rules?: any;
  options: any;
  score?: number;
  setScore?: () => void;
  disabled?: boolean;
}) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name: prop,
    rules,
  });
  return (
    <View style={styles.controllerContainer}>
      <SelectDropdown
        label={label}
        value={value as string}
        options={options}
        onSelect={(newValue) => {
          onChange(newValue);
          if (setScore) {
            setScore();
          }
        }}
        disabled={disabled}
        placeholder="请选择"
        error={!!error}
        errorMessage={error?.message as string}
        required={required}
      />
      {score ? (
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.scoreText}>+{score}积分</ThemedText>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

export function RenderMultiLevelSelect({
  control,
  label,
  prop,
  required,
  rules,
  options,
  setScore,
  disabled,
}: {
  control: Control;
  label: string;
  prop: string;
  required?: boolean;
  rules?: any;
  options: any;
  score?: number;
  setScore?: () => void;
  disabled?: boolean;
}) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name: prop,
    rules,
  });
  return (
    <LevelSelect
      label={label}
      value={value as string}
      options={options}
      onSelect={(newValue, fullPath) => {
        onChange(newValue);
        if (setScore) {
          setScore();
        }
      }}
      placeholder="请选择"
      disabled={disabled}
      error={!!error}
      errorMessage={error?.message as string}
      required={required}
    />
  );
}

export function RenderFileUpload({
  control,
  label,
  prop,
  rules,
  score,
  setScore,
  disabled,
}: {
  control: Control;
  label: string;
  prop: string;
  rules?: any;
  score?: number;
  setScore?: () => void;
  disabled?: boolean;
}) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name: prop,
    rules,
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <View>
        <ThemedText style={styles.controllerLabel}>{label}</ThemedText>
        {score ? (
          <View
            style={[
              styles.scoreContainer,
              {
                top: 0,
              },
            ]}
          >
            <ThemedText style={styles.scoreText}>+{score}积分</ThemedText>
          </View>
        ) : (
          <></>
        )}
      </View>
      <FileUpload
        initialValue={value}
        onFileSelect={(file) => {
          onChange(file);
          if (setScore) {
            setScore();
          }
        }}
        disabled={disabled}
        maxFiles={1}
        multiple={true}
        allowedSources={["gallery", "camera", "document"]}
        showPreview={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  controllerContainer: {
    position: "relative",
  },
  scoreContainer: {
    position: "absolute",
    top: -10,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#EAFBF5",
  },
  scoreText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#22C55E",
  },
  controllerLabel: {
    marginBottom: 10,
    fontSize: 14,
  },
});
