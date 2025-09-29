import FileUpload from "@/components/FileUpload";
import MultiLevelSelect from "@/components/MultiLevelSelect";
import SelectDropdown from "@/components/SelectDropdown";
import {
  Options1,
  Options2,
  Options4,
  Options5,
  validationRules,
} from "@/constants/rules";
import { useDicts, useDictsActions, useToastActions } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Checkbox,
  HelperText,
  TextInput,
  Text as TextPaper,
} from "react-native-paper";

// 表单数据类型
interface FormData {
  // 基本信息
  name: string;
  phone: string;
  idcard: string;
  sex: string;
  age: string;
  city: string;

  // 需求信息
  occupation: string;
  personSesameScore: string;
  credit: string;
  personMonthIncome: string;
  amount: string;

  // 资质信息
  personHouse: boolean;
  personCar: boolean;
  socialSecurity: boolean;
  accumulationFund: boolean;
  insurancePolicy: boolean;

  // 文件上传
  personSesameScoreFile: any;
  personHouseFile: any;
  personCarFile: any;
  personProvidentFundFile: any;
  socialSecurityFile: any;
  companyFile: any;
  personGuaranteeSlipFile: any;
}

export default function GatherScreen() {
  const { dicts } = useDicts();
  const { fetchMultipleDicts } = useDictsActions();
  const { showSuccess, showError } = useToastActions();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      idcard: "",
      sex: "",
      age: "",
      city: "",
      occupation: "",
      personSesameScore: "",
      credit: "",
      personMonthIncome: "",
      amount: "",
      personHouse: false,
      personCar: false,
      socialSecurity: false,
      accumulationFund: false,
      insurancePolicy: false,
    },
  });

  // 加载字典数据
  useEffect(() => {
    const dictTypes = [
      "sys_user_sex",
      "crm_career",
      "alipay_sesame_seed",
      "crm_credit",
      "citys_collect",
    ];
    fetchMultipleDicts(dictTypes);
  }, [fetchMultipleDicts]);

  // 渲染输入框
  const renderTextInput = (option: any) => {
    const fieldName = option.prop as keyof FormData;
    const isRequired = option.required;

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label={option.label + (isRequired ? " *" : "")}
              value={value as string}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType={option.type === "number" ? "numeric" : "default"}
              maxLength={option.maxlength}
              error={!!errors[fieldName]}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors[fieldName]}>
              {errors[fieldName]?.message as string}
            </HelperText>
          </View>
        )}
      />
    );
  };

  // 渲染选择框
  const renderSelect = (option: any) => {
    const fieldName = option.prop as keyof FormData;
    const dictData = dicts[option.dict] || [];
    const isRequired = option.required;
    // 普通下拉选择
    const selectOptions = dictData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, value } }) => (
          <SelectDropdown
            label={option.label}
            value={value as string}
            options={selectOptions}
            onSelect={onChange}
            placeholder="请选择"
            error={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message as string}
            required={isRequired}
          />
        )}
      />
    );
  };

  const renderMultiLevelSelect = (option: any) => {
    const fieldName = option.prop as keyof FormData;
    const dictData = dicts[option.dict] || [];
    const isRequired = option.required;

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, value } }) => (
          <MultiLevelSelect
            label={option.label}
            value={value as string}
            options={dictData}
            onSelect={onChange}
            placeholder="请选择"
            error={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message as string}
            required={isRequired}
          />
        )}
      />
    );
  };

  // 渲染复选框
  const renderCheckbox = (option: any) => {
    const fieldName = option.prop as keyof FormData;

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        render={({ field: { onChange, value } }) => (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={value ? "checked" : "unchecked"}
              onPress={() => onChange(!value)}
            />
            <TextPaper
              variant="bodyMedium"
              onPress={() => onChange(!value)}
              style={styles.checkboxLabel}
            >
              {option.label}
            </TextPaper>
          </View>
        )}
      />
    );
  };

  // 渲染文件上传
  const renderFileUpload = (option: any) => {
    const fieldName = option.prop as keyof FormData;

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        render={({ field: { onChange, value } }) => (
          <View style={styles.uploadContainer}>
            <TextPaper variant="bodyLarge" style={styles.uploadLabel}>
              {option.label}
            </TextPaper>
            <FileUpload
              title=""
              description=""
              onFileSelect={(file) => onChange(file)}
              multiple={false}
              showPreview={true}
            />
          </View>
        )}
      />
    );
  };

  // 渲染表单字段
  const renderFormField = (option: any) => {
    switch (option.type) {
      case "text":
      case "number":
        return renderTextInput(option);
      case "select":
        return renderSelect(option);
      case "levelSelect":
        return renderMultiLevelSelect(option);
      case "upload":
        return renderFileUpload(option);
      default:
        if (option.haveAcore && typeof option.haveAcore === "number") {
          return renderCheckbox(option);
        }
        return renderTextInput(option);
    }
  };

  // 提交表单
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      console.log("表单数据:", data);
      showSuccess("表单提交成功！");
      // 这里可以调用API提交数据
    } catch (error) {
      showError("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 下一步
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 获取当前步骤需要验证的字段
  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return Options1.map((option) => option.prop as keyof FormData);
      case 2:
        return Options2.map((option) => option.prop as keyof FormData);
      case 3:
        return Options4.map((option) => option.prop as keyof FormData);
      case 4:
        return Options5.map((option) => option.prop as keyof FormData);
      default:
        return [];
    }
  };

  // 获取当前步骤的选项
  const getCurrentStepOptions = () => {
    switch (currentStep) {
      case 1:
        return Options1;
      case 2:
        return Options2;
      case 3:
        return Options4;
      case 4:
        return Options5;
      default:
        return [];
    }
  };

  // 获取步骤标题
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "基本信息";
      case 2:
        return "需求信息";
      case 3:
        return "资质信息";
      case 4:
        return "文件上传";
      default:
        return "";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 步骤指示器 */}
        <View style={styles.stepIndicator}>
          <TextPaper variant="headlineSmall" style={styles.stepTitle}>
            {getStepTitle()}
          </TextPaper>
          <TextPaper variant="bodyMedium" style={styles.stepCounter}>
            第 {currentStep} 步，共 {totalSteps} 步
          </TextPaper>
        </View>

        <Card style={styles.formCard}>
          <Card.Content>
            {/* 渲染当前步骤的表单字段 */}
            {getCurrentStepOptions().map((option) => renderFormField(option))}
          </Card.Content>
        </Card>

        {/* 操作按钮 */}
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <Button
              mode="outlined"
              onPress={handlePrevious}
              style={[styles.button, styles.previousButton]}
            >
              上一步
            </Button>
          )}

          <Button
            mode="contained"
            onPress={handleNext}
            loading={loading}
            disabled={loading}
            style={[styles.button, styles.nextButton]}
          >
            {currentStep === totalSteps ? "提交" : "下一步"}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  stepIndicator: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  stepTitle: {
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
  },
  stepCounter: {
    color: "#666",
  },
  formCard: {
    marginBottom: 24,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    flex: 1,
  },
  uploadContainer: {
    marginBottom: 10,
  },
  uploadLabel: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
  },
  previousButton: {
    borderColor: "#1976D2",
  },
  nextButton: {
    backgroundColor: "#1976D2",
  },
});
