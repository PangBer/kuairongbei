import {
  RenderFileUpload,
  RenderMultiLevelSelect,
  RenderSelect,
  RenderTextInput,
} from "@/components/pagesComponents/subdemand";
import globalStyles from "@/components/styles/globalStyles";
import ToastModal, { ToastModalChildrenStyle } from "@/components/ToastModal";
import { ThemedText, ThemedView } from "@/components/ui";
import { customColors } from "@/constants/theme";
import {
  DemandFormData,
  DemandFormDataImpl,
  getDemandDetail,
  gradeScore,
  passone,
  passzero,
  propScoreMap,
  submitDemandSave,
  submitDemandToCommit,
  uploadKeys,
  validationRules,
} from "@/service/subDemand";
import {
  useAuth,
  useAuthActions,
  useDicts,
  useDictsActions,
  useToastActions,
} from "@/store/hooks";
import { getCitygGrade } from "@/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-paper";

export default function DemandScreen() {
  const { userInfo } = useAuth();
  const { showSuccess } = useToastActions();
  // React Hook Form
  const { control, handleSubmit, getValues, setValue } =
    useForm<DemandFormData>({
      mode: "all",
      defaultValues: {
        phone: userInfo?.mobilePhone,
      },
    });
  const { dicts } = useDicts();
  const { fetchMultipleDicts } = useDictsActions();
  const { updateUserInfo } = useAuthActions();

  const [demandDetail, setDemandDetail] = useState<any>(null);

  const [filedScore, setFiledScore] = useState<{
    [key in keyof DemandFormData]: number;
  }>({} as { [key in keyof DemandFormData]: number });
  const [grade, setGrade] = useState<keyof typeof gradeScore>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchMultipleDicts([
      "alipay_sesame_seed",
      "crm_credit",
      "citys_collect",
      "crm_career",
    ]);
    getSubDemadDetal();
  }, [fetchMultipleDicts]);

  const getSubDemadDetal = async () => {
    try {
      setLoading(true);
      const { data } = await getDemandDetail();
      if(!data) throw new Error("未保存信息");
      // 从接口返回的 data 中仅提取 DemandFormData 接口定义的字段
      const demandFormData = new DemandFormDataImpl(data);
      const newGrade = getCitygGrade(
        dicts["citys_collect"],
        data.city as string
      );
      const scoreGrade: number = gradeScore[newGrade];

      const newFiledScore: {
        [key in keyof DemandFormData]: number;
      } = { ...filedScore } as { [key in keyof DemandFormData]: number };

      Object.entries(demandFormData).forEach(([key, value]) => {
        if (value) {
          if (uploadKeys.indexOf(key) > -1) {
            value = JSON.parse(value).map((e: any) => ({
              data: e,
              message: "上传成功",
              success: true,
            }));
            newFiledScore[key as keyof DemandFormData] =
              (propScoreMap[key as keyof DemandFormData].score || 0) *
              scoreGrade;
          } else if (Object.hasOwn(propScoreMap, key)) {
            const propScore = propScoreMap[key];
            if (Object.hasOwn(propScore, "scoreLevel")) {
              let newVal = value;
              Object.entries(propScore.scoreLevel).forEach(
                ([level, leveVal]: [level: string, leveVal: any]) => {
                  if (value >= leveVal.min && value <= leveVal.max) {
                    newVal = level;
                  }
                }
              );
              newFiledScore[key as keyof DemandFormData] =
                (propScore.score[newVal as string] || 0) * scoreGrade;
            } else {
              if (passzero.indexOf(key) !== -1 && value > 0) {
                if (typeof propScore.score === "number") {
                  newFiledScore[key as keyof DemandFormData] =
                    (propScoreMap[key as keyof DemandFormData].score || 0) *
                    scoreGrade;
                } else {
                  newFiledScore[key as keyof DemandFormData] =
                    (propScore.score[value as string] || 0) * scoreGrade;
                }
              } else if (passone.indexOf(key) !== -1 && value > 1) {
                if (typeof propScore.score === "number") {
                  newFiledScore[key as keyof DemandFormData] =
                    (propScoreMap[key as keyof DemandFormData].score || 0) *
                    scoreGrade;
                } else {
                  newFiledScore[key as keyof DemandFormData] =
                    (propScore.score[value as string] || 0) * scoreGrade;
                }
              }
            }
          }
          setValue(key as keyof DemandFormData, value);
        }
      });
      setFiledScore(newFiledScore);
      setGrade(newGrade);
      setDemandDetail(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const submitDemand = handleSubmit(async (data) => {
    try {
      if (cantOperate) {
        router.push("/review");
      } else {
        setLoading(true);
        const newUuery: any = { ...demandDetail };
        Object.entries(data).forEach(([key, value]) => {
          if (uploadKeys.indexOf(key as keyof DemandFormData) > -1) {
            if (value?.length > 0) {
              newUuery[key] = JSON.stringify(value.map((e: any) => e.data));
            }
          } else if (value) {
            newUuery[key] = value;
          }
        });
        await submitDemandSave(newUuery);
        showSuccess("提交成功");
        const { data: detail } = await getDemandDetail();
        setDemandDetail(detail);
        setConfirmVisible(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  const totalScore = useMemo(() => {
    let total = 0;
    Object.values(filedScore).forEach((score) => {
      total += score;
    });
    return total;
  }, [filedScore]);

  const cantOperate = useMemo(() => {
    return demandDetail ? !demandDetail.canOperate : false;
  }, [demandDetail]);

  const calcFiledScore = (fieldName: keyof DemandFormData) => {
    let value = getValues(fieldName);

    if (fieldName !== "city") {
      const propScore = propScoreMap[fieldName];
      const scoreGrade: number = gradeScore[grade];
      let score = 0;
      if (value) {
        if (Object.hasOwn(propScore, "scoreLevel")) {
          Object.entries(propScore.scoreLevel).forEach(
            ([level, leveVal]: [level: string, leveVal: any]) => {
              if (value >= leveVal.min && value <= leveVal.max) {
                value = level;
              }
            }
          );
          score = propScore.score[value as string] || 0;
        } else {
          if (passzero.indexOf(fieldName) !== -1 && value > 0) {
            if (typeof propScore.score === "number") {
              score = propScore.score;
            } else {
              score = propScore.score[value as string];
            }
          } else if (passone.indexOf(fieldName) !== -1 && value > 1) {
            if (typeof propScore.score === "number") {
              score = propScore.score;
            } else {
              score = propScore.score[value as string];
            }
          } else if (uploadKeys.indexOf(fieldName) !== -1) {
            if (value.length > 0) {
              score = propScore.score;
            } else {
              score = 0;
            }
          }
        }
      }
      setFiledScore({ ...filedScore, [fieldName]: score * scoreGrade });
    } else {
      const newGrade = getCitygGrade(dicts["citys_collect"], value as string);
      const scoreGrade: number = gradeScore[newGrade];

      setFiledScore((pre: any) => {
        const nowScore: any = {};
        Object.keys(pre).forEach((key) => {
          nowScore[key] = (pre[key] / gradeScore[grade]) * scoreGrade;
        });
        return nowScore;
      });

      setGrade(newGrade);
    }
  };

  const handleConfirmClose = async () => {
    try {
      setLoading(true);
      await submitDemandToCommit(demandDetail.id);
      await updateUserInfo(null);
      router.push({
        pathname: "/match",
        params: {
          totalScore: totalScore,
        },
      });
    } catch (error) {
    } finally {
      setConfirmVisible(false);
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.globalContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.globalContainer}
        keyboardVerticalOffset={45}
      >
        <TouchableWithoutFeedback
          style={globalStyles.globalContainer}
          onPress={Keyboard.dismiss}
        >
          <ScrollView
            style={globalStyles.globalContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Block 1: Information Filling Guidance */}
            <View style={styles.infoBlock}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={customColors.primary}
                />
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
              <ThemedText style={styles.infoBlockTitle}>
                基本身份信息
              </ThemedText>
              <RenderTextInput
                control={control}
                label="姓名"
                prop="name"
                required={true}
                rules={validationRules.name}
                score={filedScore["name"]}
                disabled={cantOperate}
              />
              <RenderTextInput
                control={control}
                label="身份证"
                prop="idcard"
                required={true}
                rules={validationRules.idcard}
                score={filedScore["idcard"]}
                disabled={cantOperate}
              />
            </ThemedView>
            <ThemedView style={styles.formInfoBlock}>
              <ThemedText style={styles.infoBlockTitle}>资产信息</ThemedText>
              <RenderSelect
                control={control}
                label="房产信息"
                prop="personHouse"
                score={filedScore["personHouse"]}
                options={[
                  {
                    label: "无房",
                    value: "0",
                  },
                  {
                    label: "有房",
                    value: "1",
                  },
                ]}
                setScore={() => calcFiledScore("personHouse")}
                disabled={cantOperate}
              />
              <RenderFileUpload
                control={control}
                label="房产证明材料"
                prop="personHouseFile"
                score={filedScore["personHouseFile"]}
                setScore={() => calcFiledScore("personHouseFile")}
                disabled={cantOperate}
              />

              <RenderSelect
                control={control}
                label="车产信息"
                prop="personCar"
                score={filedScore["personCar"]}
                options={[
                  {
                    label: "无车",
                    value: "0",
                  },
                  {
                    label: "有车",
                    value: "1",
                  },
                ]}
                setScore={() => calcFiledScore("personCar")}
                disabled={cantOperate}
              />
              <RenderFileUpload
                control={control}
                label="车产证明材料"
                prop="personCarFile"
                score={filedScore["personCarFile"]}
                setScore={() => calcFiledScore("personCarFile")}
                disabled={cantOperate}
              />
            </ThemedView>
            <ThemedView style={styles.formInfoBlock}>
              <ThemedText style={styles.infoBlockTitle}>
                社保、公积金与保险
              </ThemedText>

              <RenderSelect
                control={control}
                label="社保信息"
                prop="socialSecurity"
                score={filedScore["socialSecurity"]}
                options={[
                  {
                    label: "未缴纳/缴纳半年以下",
                    value: "0",
                  },
                  {
                    label: "缴纳半年以上",
                    value: "1",
                  },
                ]}
                setScore={() => calcFiledScore("socialSecurity")}
                disabled={cantOperate}
              />

              <RenderFileUpload
                control={control}
                label="社保缴纳证明材料"
                prop="socialSecurityFile"
                score={filedScore["socialSecurityFile"]}
                setScore={() => calcFiledScore("socialSecurityFile")}
                disabled={cantOperate}
              />

              <RenderSelect
                control={control}
                label="公积金信息"
                prop="accumulationFund"
                score={filedScore["accumulationFund"]}
                options={[
                  {
                    label: "未缴纳/缴纳半年以下",
                    value: "0",
                  },
                  {
                    label: "缴纳半年以上",
                    value: "1",
                  },
                ]}
                setScore={() => calcFiledScore("accumulationFund")}
                disabled={cantOperate}
              />

              <RenderFileUpload
                control={control}
                label="公积金缴纳证明材料"
                prop="personProvidentFundFile"
                score={filedScore["personProvidentFundFile"]}
                setScore={() => calcFiledScore("personProvidentFundFile")}
                disabled={cantOperate}
              />

              <RenderSelect
                control={control}
                label="保险信息"
                prop="insurancePolicy"
                score={filedScore["insurancePolicy"]}
                options={[
                  {
                    label: "未无/有效期半年以下",
                    value: "0",
                  },
                  {
                    label: "有效期半年以上",
                    value: "1",
                  },
                ]}
                setScore={() => calcFiledScore("insurancePolicy")}
                disabled={cantOperate}
              />

              <RenderFileUpload
                control={control}
                label="保险保单证明材料"
                prop="personGuaranteeSlipFile"
                score={filedScore["personGuaranteeSlipFile"]}
                setScore={() => calcFiledScore("personGuaranteeSlipFile")}
                disabled={cantOperate}
              />
            </ThemedView>
            <ThemedView style={styles.formInfoBlock}>
              <ThemedText style={styles.infoBlockTitle}>职业信息</ThemedText>

              <RenderSelect
                control={control}
                label="职业身份"
                prop="occupation"
                score={filedScore["occupation"]}
                options={dicts["crm_career"]}
                setScore={() => calcFiledScore("occupation")}
                disabled={cantOperate}
              />

              <RenderFileUpload
                control={control}
                label="企业主证明材料"
                prop="companyFile"
                score={filedScore["companyFile"]}
                setScore={() => calcFiledScore("companyFile")}
                disabled={cantOperate}
              />
            </ThemedView>
            <ThemedView style={styles.formInfoBlock}>
              <ThemedText style={styles.infoBlockTitle}>收入与信用</ThemedText>

              <RenderTextInput
                control={control}
                label="打卡工资"
                prop="income"
                score={filedScore["income"]}
                setScore={() => calcFiledScore("income")}
                disabled={cantOperate}
              />

              <RenderSelect
                control={control}
                label="芝麻信用"
                prop="personSesameScore"
                score={filedScore["personSesameScore"]}
                options={dicts["alipay_sesame_seed"]}
                setScore={() => calcFiledScore("personSesameScore")}
                disabled={cantOperate}
              />

              <RenderFileUpload
                control={control}
                label="芝麻信用证明截图"
                prop="personSesameScoreFile"
                score={filedScore["personSesameScoreFile"]}
                setScore={() => calcFiledScore("personSesameScoreFile")}
                disabled={cantOperate}
              />
              <RenderSelect
                control={control}
                label="逾期情况"
                prop="credit"
                score={filedScore["credit"]}
                options={dicts["crm_credit"]}
                setScore={() => calcFiledScore("credit")}
                disabled={cantOperate}
              />
            </ThemedView>
            <ThemedView style={styles.formInfoBlock}>
              <ThemedText style={styles.infoBlockTitle}>贷款需求</ThemedText>

              <RenderTextInput
                control={control}
                label="需求金额"
                prop="amount"
                required={true}
                rules={validationRules.amount}
                score={filedScore["amount"]}
                setScore={() => calcFiledScore("amount")}
                disabled={cantOperate}
              />
              <RenderMultiLevelSelect
                control={control}
                label="贷款地"
                prop="city"
                options={dicts["citys_collect"]}
                required={true}
                rules={validationRules.city}
                setScore={() => calcFiledScore("city")}
                disabled={cantOperate}
              />
            </ThemedView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <ThemedView style={styles.footerContainer}>
        {/* Points Information Row */}
        <View style={styles.pointsInfoRow}>
          <View style={styles.pointsInfoLeft}>
            <Ionicons name="star" size={20} color="#FF9500" />
            <ThemedText style={styles.pointsInfoText}>
              已获得{totalScore}积分 (价值{totalScore / 10}元)
            </ThemedText>
          </View>
          <ThemedText style={styles.pointsConversionText}>
            10积分=1元
          </ThemedText>
        </View>

        {/* Submit Button */}
        <Button mode="contained" onPress={submitDemand} loading={loading}>
          {cantOperate ? "查看我的申请进度" : "提交资质信息"}
        </Button>

        {/* Privacy Notice */}
        <ThemedText style={styles.privacyNotice}>
          {cantOperate
            ? "您的需求已经提交，正在处理中，可以前往查看申请进度"
            : "提交即表示您信息真实性负责,我们将对您的信息严格保密"}
        </ThemedText>
      </ThemedView>
      {/* 等待提示模态框 */}
      <ToastModal
        visible={confirmVisible}
        onConfirm={handleConfirmClose}
        confirmText="属实，立即匹配"
        onCancel={() => setConfirmVisible(false)}
        cancleText="不属实，重新填写"
        loading={loading}
      >
        <View style={ToastModalChildrenStyle.modalIconContainer}>
          <AntDesign name="warning" size={48} color={customColors.error} />
        </View>
        <ThemedText style={ToastModalChildrenStyle.modalTitle}>
          温馨提示
        </ThemedText>
        <ThemedText style={ToastModalChildrenStyle.modalContent}>
          请确认您填写的资料是否属实，我们会根据您填写的真实情况进行匹配哦~
        </ThemedText>
      </ToastModal>
    </View>
  );
}

const styles = StyleSheet.create({
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

  footerContainer: {
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
