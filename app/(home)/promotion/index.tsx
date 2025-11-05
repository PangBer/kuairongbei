import { ThemedText } from "@/components/ui";
import { ThemedCard } from "@/components/ui/themedCard";
import globalStyles from "@/styles/globalStyles";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

// Design tokens for consistent spacing/colors/radius
const P = 12; // base padding
const R = 12; // base radius
const COLORS = {
  blue: "#027BFF",
  blueLight: "#359BFF",
  white: "#ffffff",
  brandPrimary: "#F15E49",
  brandAccent: "#FF5D24",
  accentOrange: "#ff6d00",
  accentRed: "#ff4d4f",
  sand: "#FFF7EC",
  sandDeep: "#F5E8C8",
  sandChip: "#FFE9C4",
  textMuted: "#97928D",
  textBrown: "#9C734F",
  textSubtle: "#A8815D",
  success: "#7CB444",
  warning: "#FFA000",
};

// Small presentational atoms
const SectionButton = ({ title, color }: { title: string; color: string }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[styles.btn, { backgroundColor: color }]}
  >
    <ThemedText style={styles.btnText}>{title}</ThemedText>
  </TouchableOpacity>
);

const KPIItem = ({ main, sub }: { main: string; sub: string }) => (
  <View style={styles.kpi}>
    <ThemedText style={styles.kpiMain}>{main}</ThemedText>
    <ThemedText style={styles.kpiSub}>{sub}</ThemedText>
  </View>
);

const MilestoneItem = ({
  amount,
  label,
}: {
  amount: string;
  label: string;
}) => (
  <View style={styles.milestone}>
    <View style={styles.lockBadge}>
      <ThemedText style={styles.lockBadgeText}>￥</ThemedText>
    </View>
    <ThemedText style={styles.milestoneAmount}>{amount}</ThemedText>
    <ThemedText style={styles.milestoneLabel}>{label}</ThemedText>
  </View>
);

export default () => {
  const steps = [
    { title: "注册通过", reward: "10元" },
    { title: "资料通过", reward: "40元" },
  ];
  const milestones = [
    { label: "达1人", amount: "20" },
    { label: "达5人", amount: "100" },
    { label: "达10人", amount: "500" },
    { label: "达50人", amount: "1000" },
  ];
  const records = [
    { name: "大明", reg: "通过", regAmt: "10", info: "通过", infoAmt: "40" },
    { name: "大明", reg: "通过", regAmt: "10", info: "审核中", infoAmt: "40" },
    { name: "大明", reg: "通过", regAmt: "10", info: "未通过", infoAmt: "40" },
  ];

  return (
    <ScrollView
      style={[globalStyles.globalContainer, { backgroundColor: COLORS.blue }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>
          邀请一名新用户{"\n"}
          最高奖励
          <ThemedText style={styles.headerTitleHighlight}>50</ThemedText>元
        </ThemedText>
        <View style={styles.headerTag}>
          <ThemedText style={styles.headerTagText}>
            随时提现，奖金不封顶
          </ThemedText>
        </View>
      </View>

      {/* 奖励规则卡片 */}
      <ThemedCard style={styles.ruleCard}>
        <ThemedText style={styles.ruleTitle}>50元现金如何得到</ThemedText>
        <View style={styles.ruleStepsRow}>
          {steps.map((s, i) => (
            <View key={s.title}>
              {i === 1 && <ThemedText style={styles.plus}>＋</ThemedText>}
              <View style={styles.ruleStep}>
                <View style={styles.ruleBadge}>
                  <ThemedText style={styles.ruleStepMain}>{s.title}</ThemedText>
                  <View style={styles.dashedLine} />
                  <ThemedText style={styles.ruleStepSub}>{s.reward}</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.ruleMilestoneContainer}>
          <ThemedText style={styles.ruleTitleSmall}>
            邀请至指定人数再得奖励
          </ThemedText>
          <View style={styles.milestoneRow}>
            {milestones.map((m) => (
              <MilestoneItem key={m.label} amount={m.amount} label={m.label} />
            ))}
          </View>
        </View>
        <SectionButton title="立即邀请" color={COLORS.accentOrange} />
      </ThemedCard>

      {/* 收益卡片 */}
      <ThemedCard style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryProfile}>
            <View style={styles.avatar} />
            <ThemedText style={styles.profileName}>小明同学</ThemedText>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <ThemedText style={styles.linkText}>收益明细</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedCard style={styles.summaryCard}>
          <View style={styles.kpiRow}>
            <KPIItem main="3人" sub="成功邀请" />
            <KPIItem main="150元" sub="累计收益" />
            <KPIItem main="100元" sub="可提现" />
          </View>

          <SectionButton title="去提现" color={COLORS.accentRed} />

          <ThemedText style={styles.tips}>
            每日最多可提现X次，最多不超过X元
          </ThemedText>
        </ThemedCard>

        {/* 邀请记录 */}
        <ThemedCard style={styles.recordsCard}>
          <ThemedText style={styles.recordsTitle}>邀请记录</ThemedText>
          {records.map((item, idx) => (
            <View key={idx}>
              {idx === 0 && (
                <View style={styles.recordRow}>
                  <View style={styles.recordUser}>
                    <ThemedText style={styles.recordName}>姓名</ThemedText>
                  </View>
                  <View style={styles.recordCols}>
                    <View style={styles.recordColName}>
                      <ThemedText style={styles.recordName}>注册</ThemedText>
                    </View>
                    <View style={styles.recordColName}>
                      <ThemedText style={styles.recordName}>审核</ThemedText>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.recordRow}>
                <View style={styles.recordUser}>
                  <ThemedText style={styles.recordName}>{item.name}</ThemedText>
                </View>
                <View style={styles.recordCols}>
                  <View style={styles.recordCol}>
                    <View style={styles.badgeColumn}>
                      <AntDesign
                        name="check-circle"
                        size={24}
                        color="#7CB444"
                      />
                      <ThemedText style={styles.badgeSuccess}>
                        {item.reg}
                      </ThemedText>
                    </View>
                    <View
                      style={[styles.dashedLine, { borderColor: "#EFD1B4" }]}
                    />
                    <ThemedText style={styles.recordAmt}>
                      {item.regAmt}元
                    </ThemedText>
                  </View>
                  <View style={styles.recordCol}>
                    <View style={styles.badgeColumn}>
                      <AntDesign
                        name="check-circle"
                        size={24}
                        color="#FFA000"
                      />
                      <ThemedText style={styles.badgeInfo}>
                        {item.info}
                      </ThemedText>
                    </View>
                    <View
                      style={[styles.dashedLine, { borderColor: "#EFD1B4" }]}
                    />
                    <ThemedText style={styles.recordAmt}>
                      {item.infoAmt}元
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <ThemedText style={styles.footerNote}>
            没有更多了，继续加油！
          </ThemedText>
        </ThemedCard>
      </ThemedCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: P + 8,
    paddingTop: P + 12,
    paddingBottom: P * 2,
  },
  headerBrand: {
    color: "#fff",
    opacity: 0.95,
    fontSize: 12,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 34,
    textAlign: "center",
  },
  headerTitleHighlight: {
    color: "#ffd54f",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  headerTag: {
    marginTop: 14,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  headerTagText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },

  ruleCard: {
    backgroundColor: COLORS.sand,
  },
  ruleTitle: {
    color: COLORS.brandPrimary,
    textAlign: "center",
    fontSize: 14,
    marginBottom: 12,
  },
  ruleStepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 25,
  },
  ruleStep: {
    alignItems: "center",
    justifyContent: "center",
  },
  ruleBadge: {
    width: 98,
    backgroundColor: COLORS.brandPrimary,
    marginBottom: 8,
    borderRadius: R,
  },
  ruleStepMain: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.white,
  },
  ruleStepSub: {
    fontSize: 12,
    textAlign: "center",
    color: COLORS.white,
  },
  dashedLine: {
    width: "100%",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#fff",
    alignSelf: "center",
    opacity: 0.5,
    marginVertical: 4,
  },
  plus: {
    fontSize: 28,
    marginHorizontal: 8,
    color: COLORS.brandPrimary,
  },
  ruleMilestoneContainer: {
    marginVertical: 16,
    backgroundColor: COLORS.sandDeep,
    padding: 16,
    borderRadius: R,
    borderWidth: 1,
    borderColor: "#BBBBBB",
    borderStyle: "dashed",
  },
  ruleTitleSmall: {
    color: COLORS.textBrown,
    textAlign: "center",
    fontSize: 12,
    marginBottom: 10,
  },
  milestoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  milestone: {
    width: "23%",
    backgroundColor: COLORS.brandAccent,
    borderRadius: R - 2,
    paddingVertical: 12,
    alignItems: "center",
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffcc80",
    marginBottom: 6,
  },
  lockBadgeText: {
    fontSize: 16,
    color: "#C12529",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "700",
  },
  milestoneAmount: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.white,
  },
  milestoneLabel: {
    fontSize: 12,
    marginTop: 2,
    color: COLORS.white,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 26,
    marginTop: 10,
  },
  btnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },

  summaryContainer: {
    marginTop: 10,
    backgroundColor: COLORS.blueLight,
  },
  summaryCard: {
    marginTop: 10,
    backgroundColor: COLORS.sand,
    marginHorizontal: 0,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0f2fe",
    marginRight: 8,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.white,
  },
  kpiRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kpi: {
    width: "32%",
    backgroundColor: COLORS.sandChip,
    borderRadius: R - 2,
    paddingVertical: 12,
    alignItems: "center",
  },
  kpiMain: {
    color: COLORS.brandPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  kpiSub: {
    fontSize: 12,
    marginTop: 4,
    color: COLORS.textSubtle,
  },
  cashBtn: {
    marginTop: 16,
  },
  cashBtnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  tips: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
  },

  recordsCard: {
    marginTop: 10,
    backgroundColor: COLORS.sand,
    marginHorizontal: 0,
  },
  recordsTitle: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.brandPrimary,
    marginBottom: 10,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  recordUser: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recordName: {
    color: "#87837E",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  recordCols: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordColName: {
    alignItems: "center",
    width: "45%",
  },
  recordCol: {
    alignItems: "center",
    width: "45%",
    paddingVertical: 5,
    backgroundColor: COLORS.sandChip,
    borderRadius: R - 2,
  },
  badgeColumn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  badgeSuccess: {
    color: COLORS.success,
    fontSize: 12,
  },
  badgeInfo: {
    color: COLORS.warning,
    fontSize: 12,
  },
  recordAmt: {
    color: COLORS.brandPrimary,
    fontSize: 12,
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
    color: COLORS.textMuted,
  },
});
