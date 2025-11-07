import LevelSelect from "@/components/LevelSelect";
import PageHeader from "@/components/PageHeader";
import SelectDropdown from "@/components/SelectDropdown";
import globalStyles from "@/components/styles/globalStyles";
import { ThemedCard, ThemedText } from "@/components/ui";
import { useDicts, useDictsActions } from "@/store/hooks";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import {
  Appbar,
  Card,
  HelperText,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
// 表单数据类型
interface InfoFormData {
  name: string;
  phone: string;
  sex: string;
  birthDate: string;
  email: string;
  personSesameScore: string;
  credit: string;
  city: string;
  personHouse: string;
  personCar: string;
  accumulationFund: string;
  socialSecurity: string;
  personMonthIncome: string;
}
// 验证规则
const validationRules = {};
export default function InfoScreen() {
  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InfoFormData>({
    mode: "onBlur",
    defaultValues: {
      name: "张晓明",
      phone: "138****5678",
      sex: "0",
      birthDate: dayjs().format("YYYY/MM/DD"),
      email: "zhangxm@example.com",
      personSesameScore: "685",
      credit: "no",
      city: "",
      personHouse: "",
      personCar: "",
      accumulationFund: "",
      socialSecurity: "",
      personMonthIncome: "",
    },
  });
  const { dicts } = useDicts();
  const { fetchMultipleDicts } = useDictsActions();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [isEdit, setIsEdit] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  useEffect(() => {
    fetchMultipleDicts([
      "crm_social_house",
      "alipay_sesame_seed",
      "crm_credit",
      "citys_collect",
    ]);
  }, [fetchMultipleDicts]);

  // 渲染输入框
  const renderTextInput = (option: any) => {
    const fieldName = option.prop as keyof InfoFormData;

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
              editable={!option.disabled && isEdit}
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
    const fieldName = option.prop as keyof InfoFormData;
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
            disabled={!isEdit}
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
    const fieldName = option.prop as keyof InfoFormData;
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
            disabled={!isEdit}
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
  const renderRadioButton = (option: any) => {
    const fieldName = option.prop as keyof InfoFormData;
    const radioOptions = option.options || [];

    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, value } }) => (
          <>
            <ThemedText style={styles.fieldLabel}>{option.label}</ThemedText>
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioGroup}>
                {radioOptions.map((radio: any) => (
                  <View style={styles.radioOption} key={radio.value}>
                    <RadioButton value={radio.value} disabled={!isEdit} />
                    <ThemedText style={styles.radioLabel}>
                      {radio.label}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors[fieldName]}>
              {errors[fieldName]?.message as string}
            </HelperText>
          </>
        )}
      />
    );
  };
  // 定义渲染日期选择器方法
  const renderDatePicker = (option: any) => {
    const fieldName = option.prop as keyof InfoFormData;
    const openDate = () => {
      if (!isEdit) return;
      setDatePickerVisible(true);
    };
    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        rules={validationRules[fieldName as keyof typeof validationRules]}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity activeOpacity={1} onPress={openDate}>
              {/* 这里可以根据实际使用的日期组件替换 */}
              <TextInput
                label={option.label}
                value={value}
                mode="outlined"
                editable={false}
                right={<TextInput.Icon icon="calendar" onPress={openDate} />}
                error={!!errors[fieldName]}
              />
              <HelperText type="error" visible={!!errors[fieldName]}>
                {errors[fieldName]?.message as string}
              </HelperText>
            </TouchableOpacity>
            <DatePickerModal
              locale="zh"
              mode="single"
              visible={datePickerVisible}
              onDismiss={() => {
                setDatePickerVisible(false);
              }}
              date={dateValue}
              onConfirm={(param) => {
                // @ts-ignore
                setDateValue(param.date);
                setDatePickerVisible(false);
                onChange(dayjs(param.date).format("YYYY/MM/DD"));
              }}
              inputEnabled={false}
              label="选择日期"
              saveLabel="保存"
              startYear={1949}
              validRange={{
                startDate: new Date(1949, 0, 1),
                endDate: new Date(),
              }}
            />
          </>
        )}
      />
    );
  };
  const saveSubmit = handleSubmit((data) => {
    console.log(data);
    setIsEdit(false);
  });
  return (
    <View style={globalStyles.globalContainer}>
      {/* 自定义Header */}
      <PageHeader title="我的资料">
        <Appbar.Action
          icon={() => (
            <AntDesign
              name={isEdit ? "save" : "edit"}
              size={24}
              color={isDark ? "#ffffff" : "#1a1a1a"}
            />
          )}
          onPress={() => {
            if (isEdit) {
              saveSubmit();
            } else {
              setIsEdit(true);
            }
          }}
        />
      </PageHeader>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 基本信息 */}
        <ThemedCard>
          <Card.Title title="基本信息" titleStyle={styles.sectionTitle} />

          {/* 姓名 */}
          {renderTextInput({
            label: "姓名",
            prop: "name",
            type: "text",
            required: true,
          })}

          {/* 手机号码 */}
          <HelperText type="error" style={styles.hintText}>
            手机号码用于登录,不可修改
          </HelperText>
          {renderTextInput({
            label: "手机号码",
            prop: "phone",
            type: "number",
            disabled: true,
          })}

          {/* 性别 */}
          {renderRadioButton({
            label: "性别",
            prop: "sex",
            options: [
              {
                label: "保密",
                value: "0",
              },
              {
                label: "男",
                value: "1",
              },
              {
                label: "女",
                value: "2",
              },
            ],
          })}

          {/* 出生日期 */}
          {renderDatePicker({
            label: "出生日期",
            prop: "birthDate",
          })}

          {/* 邮箱 */}

          {renderTextInput({
            label: "邮箱",
            prop: "email",
            type: "email",
            required: true,
          })}
        </ThemedCard>

        {/* 信用与贷款信息 */}
        <ThemedCard>
          <Card.Title title="信用与贷款信息" titleStyle={styles.sectionTitle} />

          {/* 芝麻信用分 */}

          {renderSelect({
            label: "芝麻信用分",
            prop: "personSesameScore",
            dict: "alipay_sesame_seed",
          })}

          {/* 是否有逾期记录 */}

          {renderSelect({
            label: "逾期情况",
            prop: "credit",
            dict: "crm_credit",
          })}

          {/* 贷款地区 */}
          {renderMultiLevelSelect({
            label: "贷款地区",
            prop: "city",
            dict: "citys_collect",
          })}
        </ThemedCard>

        {/* 资产信息 */}
        <ThemedCard>
          <Card.Title title="资产信息" titleStyle={styles.sectionTitle} />
          {/* 房产情况 */}
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
          {/* 车辆情况 */}
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
        </ThemedCard>

        {/* 收入与社保信息 */}
        <ThemedCard>
          <Card.Title title="收入与社保信息" titleStyle={styles.sectionTitle} />
          {/* 公积金 */}
          {renderSelect({
            label: "公积金信息",
            prop: "accumulationFund",
            dict: "crm_social_house",
          })}
          {/* 社保 */}
          {renderSelect({
            label: "社保信息",
            prop: "socialSecurity",
            dict: "crm_social_house",
          })}
          {/* 打卡月收入 */}
          {renderTextInput({
            label: "打卡工资",
            prop: "personMonthIncome",
            type: "number",
          })}
        </ThemedCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
  },
  hintText: {
    fontSize: 12,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: 4,
  },
  scoreWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  scoreContainer: {
    flex: 1,
  },
  scoreInput: {
    flex: 1,
  },
  scoreInputContent: {
    fontSize: 18,
    fontWeight: "500",
  },
  scoreUnit: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },
});
