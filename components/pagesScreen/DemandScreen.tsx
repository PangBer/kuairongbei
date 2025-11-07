import FileUpload from "@/components/FileUpload";
import LevelSelect from "@/components/LevelSelect";
import SelectDropdown from "@/components/SelectDropdown";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import { useDicts, useDictsActions } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
// 表单数据类型
interface DemandFormData {
  name: string;
  idcard: string;
  city: string;
}
// 验证规则
const validationRules = {
  name: {
    required: "请输入真实姓名",
  },
  idcard: {
    required: "请输入身份证",
    pattern: {
      value:
        /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
      message: "请输入正确的身份证",
    },
  },
  city: {
    required: "请选择贷款地",
  },
  amount: {
    required: "请输入需求金额",
    min: {
      value: 1000,
      message: "请输入正确的金额,最小金额为1000元",
    },
    max: {
      value: 1000000,
      message: "请输入正确的金额,最大金额为1000000元",
    },
  },
};
export default function DemandScreen() {
  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<DemandFormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      idcard: "",
      city: "",
    },
  });
  const { dicts } = useDicts();
  const { fetchMultipleDicts } = useDictsActions();
  const pathname = usePathname();
  useEffect(() => {
    fetchMultipleDicts([
      "crm_social_house",
      "alipay_sesame_seed",
      "crm_credit",
      "citys_collect",
    ]);
  }, [fetchMultipleDicts]);

  const submitDemand = handleSubmit(async (data) => {
    // console.log(data);
    if (pathname === "/demand") {
      router.push("/match");
    } else {
      router.replace("/match");
    }
  });

  // 渲染输入框
  const renderTextInput = (option: any) => {
    const fieldName = option.prop as keyof DemandFormData;

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={`${option.label} ${option.required ? "*" : ""}`}
              value={value as string}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType={option.type === "number" ? "numeric" : "default"}
              maxLength={option.maxlength}
              error={!!errors[fieldName]}
            />
            <HelperText type="error" visible={!!errors[fieldName]}>
              {errors[fieldName]?.message as string}
            </HelperText>
          </>
        )}
      />
    );
  };

  // 渲染选择框
  const renderSelect = (option: any) => {
    const fieldName = option.prop as keyof DemandFormData;
    const dictData = option["options"] || dicts[option.dict] || [];

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
            options={dictData}
            onSelect={(newValue) => {
              // 使用 setValue 同步更新值
              const timmer = setTimeout(() => {
                // 使用 setValue 同步更新值
                setValue(fieldName, newValue as any, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
                clearTimeout(timmer);
              }, 100);
            }}
            placeholder="请选择"
            error={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message as string}
            required={option.required}
          />
        )}
      />
    );
  };

  const renderMultiLevelSelect = (option: any) => {
    const fieldName = option.prop as keyof DemandFormData;
    const dictData = option["options"] || dicts[option.dict] || [];

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, value } }) => (
          <LevelSelect
            label={option.label}
            value={value as string}
            options={dictData}
            onSelect={(newValue, fullPath) => {
              // 在下一个事件循环中触发验证，确保使用的是新值
              const timmer = setTimeout(() => {
                // 使用 setValue 同步更新值
                setValue(fieldName, newValue as any, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
                clearTimeout(timmer);
              }, 100);
            }}
            placeholder="请选择"
            error={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message as string}
            required={option.required}
          />
        )}
      />
    );
  };
  // 渲染文件上传
  const renderFileUpload = (option: any) => {
    const fieldName = option.prop as keyof DemandFormData;

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: 16 }}>
            <ThemedText style={styles.controllerLabel}>
              {option.label}
            </ThemedText>
            <FileUpload
              onFileSelect={onChange}
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
  return (
    <View style={globalStyles.globalContainer}>
      <ScrollView
        style={globalStyles.globalContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Block 1: Information Filling Guidance */}
        <View style={styles.infoBlock}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={20} color="#4a9aff" />
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.infoText}>
              请如实填写以下信息,完善的资质证明将有助于提高审批通过率和贷款额度
            </ThemedText>
          </View>
        </View>
        {/* Block 2: Welfare Information and Points System */}
        <View style={styles.pointsBlock}>
          <View style={styles.pointsRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="gift" size={20} color="#22C55E" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.pointsText}>
                填写福利信息赢积分:每完成一项额外信息填写可获得相应积分,10积分可兑换1元现金！
              </ThemedText>
            </View>
          </View>
          <View style={[styles.pointsRow, styles.pointsRowLast]}>
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={20} color="#22C55E" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={[styles.pointsText, { color: "#22C55E" }]}>
                当前可获得最高150积分(价值15元)
              </ThemedText>
            </View>
          </View>
        </View>
        <ThemedView style={styles.formInfoBlock}>
          <ThemedText style={styles.infoBlockTitle}>基本身份信息</ThemedText>
          {renderTextInput({
            label: "姓名",
            prop: "name",
            required: true,
          })}
          {renderTextInput({
            label: "身份证",
            prop: "idcard",
            required: true,
          })}
        </ThemedView>
        <ThemedView style={styles.formInfoBlock}>
          <ThemedText style={styles.infoBlockTitle}>资产信息</ThemedText>
          {renderSelect({
            label: "房产信息",
            prop: "personHouse",
            options: [
              {
                label: "无房",
                value: "0",
              },
              {
                label: "有房",
                value: "1",
              },
            ],
          })}
          {renderFileUpload({
            prop: "personHouseFile",
            label: "房产证明材料",
          })}
          {renderSelect({
            label: "车产信息",
            prop: "personCar",
            options: [
              {
                label: "无车",
                value: "0",
              },
              {
                label: "有车",
                value: "1",
              },
            ],
          })}
          {renderFileUpload({
            prop: "personCarFile",
            label: "车产证明材料",
          })}
        </ThemedView>
        <ThemedView style={styles.formInfoBlock}>
          <ThemedText style={styles.infoBlockTitle}>社保与公积金</ThemedText>
          {renderSelect({
            label: "社保信息",
            prop: "socialSecurity",
            dict: "crm_social_house",
          })}
          {renderFileUpload({
            prop: "socialSecurityFile",
            label: "社保缴纳证明材料",
          })}
          {renderSelect({
            label: "公积金信息",
            prop: "accumulationFund",
            dict: "crm_social_house",
          })}
          {renderFileUpload({
            prop: "personProvidentFundFile",
            label: "公积金缴纳证明材料",
          })}
        </ThemedView>
        <ThemedView style={styles.formInfoBlock}>
          <ThemedText style={styles.infoBlockTitle}>收入与信用</ThemedText>
          {renderTextInput({
            label: "打卡工资",
            prop: "personMonthIncome",
            type: "number",
          })}
          {renderSelect({
            label: "芝麻信用",
            prop: "personSesameScore",
            dict: "alipay_sesame_seed",
          })}
          {renderFileUpload({
            prop: "personSesameScoreFile",
            label: "芝麻信用证明截图",
          })}
          {renderSelect({
            label: "逾期情况",
            prop: "credit",
            dict: "crm_credit",
          })}
        </ThemedView>
        <ThemedView style={styles.formInfoBlock}>
          <ThemedText style={styles.infoBlockTitle}>贷款需求</ThemedText>
          {renderMultiLevelSelect({
            label: "贷款地",
            prop: "city",
            dict: "citys_collect",
            required: true,
          })}
          {renderTextInput({
            label: "需求金额",
            prop: "amount",
            type: "number",
            required: true,
          })}
        </ThemedView>
      </ScrollView>
      <ThemedView style={styles.footerContainer}>
        {/* Points Information Row */}
        <View style={styles.pointsInfoRow}>
          <View style={styles.pointsInfoLeft}>
            <Ionicons name="star" size={20} color="#FF9500" />
            <ThemedText style={styles.pointsInfoText}>
              已获得0积分 (价值0元)
            </ThemedText>
          </View>
          <ThemedText style={styles.pointsConversionText}>
            10积分=1元
          </ThemedText>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={submitDemand}
        >
          <ThemedText style={styles.submitButtonText}>提交资质信息</ThemedText>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <ThemedText style={styles.privacyNotice}>
          提交即表示您信息真实性负责,我们将对您的信息严格保密
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  controllerLabel: {
    marginBottom: 10,
    fontSize: 14,
  },
  infoBlock: {
    flexDirection: "row",
    backgroundColor: "#f0f8ff",
    padding: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  pointsBlock: {
    backgroundColor: "#EDF8F7",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  pointsRowLast: {
    marginBottom: 0,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
  pointsText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
  scrollContent: {
    paddingBottom: 155, // 为底部固定组件留出空间
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  pointsInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pointsInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pointsInfoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  pointsConversionText: {
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: customColors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyNotice: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  formInfoBlock: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },

  infoBlockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
