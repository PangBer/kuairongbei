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
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
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
  const [currentStep, setCurrentStep] = useState(4);
  const totalSteps = 4;

  // 步骤数据
  const steps = [
    { icon: "file-text", label: "填信息", step: 0 },
    { icon: "contacts", label: "定需求", step: 1 },
    { icon: "ci-circle", label: "选资质", step: 2 },
    { icon: "upload", label: "传附件", step: 3 },
  ];

  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "all",
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
          <View style={styles.inputContainer}>
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
          </View>
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
          <View style={styles.inputContainer}>
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
          </View>
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
              onFileSelect={(file) => onChange(file)}
              maxFiles={1}
              multiple={true}
              allowedSources={["gallery", "camera", "document"]}
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
      case "checkbox":
        return renderCheckbox(option);
      case "upload":
        return renderFileUpload(option);
      default:
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
        return Options1.map((option) => option.prop as keyof FormData); // 基本信息
      case 2:
        return Options2.map((option) => option.prop as keyof FormData); // 需求信息
      case 3:
        return Options4.map((option) => option.prop as keyof FormData); // 资质信息
      case 4:
        return Options5.map((option) => option.prop as keyof FormData); // 文件上传
      default:
        return [];
    }
  };

  // 获取当前步骤的选项
  const getCurrentStepOptions = () => {
    switch (currentStep) {
      case 1:
        return Options1; // 基本信息
      case 2:
        return Options2; // 需求信息
      case 3:
        return Options4; // 资质信息
      case 4:
        return Options5; // 文件上传
      default:
        return [];
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 顶部渐变区域 */}
        <LinearGradient
          colors={["#4a9aff", "#6ab0ff"]}
          style={styles.headerGradient}
        >
          {/* 步骤导航 */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepsRow}>
              {steps.map((step, index) => (
                <View key={step.label} style={styles.stepItem}>
                  <View style={styles.stepContent}>
                    <View
                      style={[
                        styles.stepCircle,
                        {
                          backgroundColor:
                            index < currentStep - 1
                              ? "#10B981"
                              : index === currentStep - 1
                              ? "#F59E0B"
                              : "rgba(255,255,255,0.2)",
                        },
                      ]}
                    >
                      <AntDesign
                        name={step.icon as any}
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>
                    <TextPaper
                      style={[
                        styles.stepLabel,
                        {
                          color:
                            index <= currentStep - 1
                              ? "#FFFFFF"
                              : "rgba(255,255,255,0.6)",
                        },
                      ]}
                    >
                      {step.label}
                    </TextPaper>
                  </View>
                  {index < steps.length - 1 && (
                    <View style={styles.stepConnector}>
                      <AntDesign
                        name="right"
                        size={16}
                        color="rgba(255,255,255,0.8)"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* 积分显示 */}
          <View style={styles.pointsDisplay}>
            <TextPaper style={styles.pointsLabel}>当前累计积分：</TextPaper>
            <TextPaper style={styles.pointsValue}>120</TextPaper>
            <TextPaper style={styles.pointsUnit}>💰 10积分 = 1元</TextPaper>
          </View>
        </LinearGradient>

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
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepContent: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  stepConnector: {
    marginHorizontal: 8,
    marginBottom: 20,
  },
  pointsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pointsLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  pointsValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  pointsUnit: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: -16,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 16,
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
    marginBottom: 16,
  },
  uploadLabel: {
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previousButton: {
    borderColor: "#4a9aff",
  },
  nextButton: {
    backgroundColor: "#4a9aff",
  },
});
