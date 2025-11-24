import globalStyles from "@/components/styles/globalStyles";
import { ThemedText } from "@/components/ui";
import { Colors, customColors } from "@/constants/theme";
import { imageCodeApi, sendLoginAPi, smsCodeApi, userInfoApi } from "@/service";
import { useAuthActions, useToastActions } from "@/store/hooks";
import { setToken } from "@/utils/token";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  HelperText,
  TextInput,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 表单数据类型
interface LoginFormData {
  phone: string;
  code: string;
  smsCode: string;
  inviteCode?: string;
}
// 验证规则
const validationRules = {
  phone: {
    required: "请输入登录账号",
    pattern: {
      value: /^(1[3-9]\d{9}|[^\s@]+@[^\s@]+\.[^\s@]+)$/,
      message: "请输入正确的手机号或邮箱",
    },
  },
  code: {
    required: "请输入图像验证码",
  },
  smsCode: {
    required: "请输入短信验证码",
    pattern: {
      value: /^\d{4}$/,
      message: "短信验证码为4位数字",
    },
  },
};
type Theme = keyof typeof Colors;

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { login } = useAuthActions();
  const { showInfo } = useToastActions();
  const inset = useSafeAreaInsets();
  const theme = useColorScheme() as Theme;
  const [isRegister, setIsRegister] = useState(false);
  // React Hook Form
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    trigger,
    clearErrors,
  } = useForm<LoginFormData>({
    mode: "all",
    defaultValues: {
      phone: "",
      code: "",
      smsCode: "",
      inviteCode: "",
    },
  });
  useEffect(() => {
    if (redirect !== "/demand") {
      return () => {};
    }
    // 拦截物理返回键
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/");
        return true; // 阻止默认行为
      }
    );
    return () => backHandler.remove();
  }, [redirect]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
  }, []);
  // 其他状态
  const [captchaId, setCaptchaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageCaptchaLoading, setImageCaptchaLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [captchaImage, setCaptchaImage] = useState("");

  // 组件加载时获取图像验证码
  useEffect(() => {
    getImageCaptcha();
  }, []);

  // 获取图像验证码
  const getImageCaptcha = async () => {
    setImageCaptchaLoading(true);
    try {
      // 模拟 API 调用
      const response = await imageCodeApi();

      setCaptchaId(response.data.uuid);
      setCaptchaImage("data:image/gif;base64," + response.data.img);
    } catch (error) {
      console.error("获取图像验证码失败:", error);
    } finally {
      setImageCaptchaLoading(false);
    }
  };

  // 验证图像验证码并获取短信验证码
  const getSmsCode = async () => {
    // 验证用户名和图像验证码
    const isValid = await trigger(["phone", "code"]);
    if (!isValid) {
      return;
    }

    setSmsLoading(true);
    try {
      // 模拟 API 调用
      const response = await smsCodeApi({
        phone: getValues("phone"),
        code: getValues("code"),
        uuid: captchaId,
      });
      startCountdown();
      // 开发环境下的验证码提示
      if (__DEV__) {
        showInfo("短信验证码", response.data.response);
      }
    } catch (error) {
      // 获取短信验证码失败时弹出错误提示
      getImageCaptcha();
    } finally {
      setSmsLoading(false);
    }
  };

  // 开始倒计时
  const startCountdown = () => {
    setSmsCountdown(60);
    const timer = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 提交登录
  const handleLogin = handleSubmit(async (data) => {
    setLoading(true);
    try {
      // 模拟 API 调用

      const response = await sendLoginAPi({
        mobilePhone: data.phone,
        smsCode: data.smsCode,
        grantType: "h5sms",
        tenantId: "000000",
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
        inviteCode: data.inviteCode,
      });

      // 先存储 token
      await setToken(response.data.access_token);
      const res = await userInfoApi();
      await login(res.data);
      // 登录成功后跳转到指定页面或首页
      const redirectPath = redirect || "/";
      router.replace(redirectPath as any);
    } catch (error) {
      getImageCaptcha();
    } finally {
      setLoading(false);
    }
  });

  const switchRegister = () => {
    if (!isValid) {
      clearErrors();
    }

    setIsRegister(!isRegister);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[theme as Theme].background,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.globalContainer}
        keyboardVerticalOffset={inset.top}
        enabled={isKeyboardVisible}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView style={[globalStyles.globalContainer, styles.page]}>
            {/* 标题区域 */}

            <View style={styles.headerContainer}>
              <Avatar.Text size={96} label="融" />
            </View>

            {/* 登录账号 */}
            <View>
              <Controller
                control={control}
                name="phone"
                rules={validationRules.phone}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="登录账号 *"
                      placeholder="请输入手机号"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      autoCorrect={false}
                      mode="outlined"
                      error={!!errors.phone}
                    />
                    <HelperText type="error" visible={!!errors.phone}>
                      {errors?.phone?.message as string}
                    </HelperText>
                  </>
                )}
              />
            </View>

            {/* 图像验证码 */}
            <View>
              <View style={styles.captchaContainer}>
                <Controller
                  control={control}
                  name="code"
                  rules={validationRules.code}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="图像验证码 *"
                      placeholder="请输入验证码"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      maxLength={4}
                      mode="outlined"
                      error={!!errors.code}
                      style={styles.captchaInput}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.captchaImageContainer}
                  onPress={getImageCaptcha}
                  activeOpacity={0.8}
                >
                  {imageCaptchaLoading ? (
                    <ActivityIndicator size="small" />
                  ) : captchaImage ? (
                    <Image
                      source={{ uri: captchaImage }}
                      style={styles.captchaImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <ThemedText style={styles.captchaPlaceholder}>
                      点击获取
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </View>
              <HelperText type="error" visible={!!errors.code}>
                {errors?.code?.message as string}
              </HelperText>
            </View>

            {/* 短信验证码 */}
            <View>
              <View style={styles.smsContainer}>
                <Controller
                  control={control}
                  name="smsCode"
                  rules={validationRules.smsCode}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="短信验证码 *"
                      placeholder="请输入短信验证码"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      maxLength={6}
                      mode="outlined"
                      error={!!errors.smsCode}
                      style={styles.smsInput}
                    />
                  )}
                />
                <Button
                  mode="outlined"
                  onPress={getSmsCode}
                  disabled={smsCountdown > 0 || smsLoading}
                  loading={smsLoading}
                  style={styles.smsButton}
                >
                  {smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码"}
                </Button>
              </View>
              <HelperText type="error" visible={!!errors.smsCode}>
                {errors?.smsCode?.message as string}
              </HelperText>
            </View>

            {isRegister ? (
              <Controller
                control={control}
                name="inviteCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="邀请码"
                    placeholder="请输入邀请码"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    maxLength={6}
                    mode="outlined"
                    error={!!errors.inviteCode}
                    style={styles.smsInput}
                  />
                )}
              />
            ) : (
              <></>
            )}
            {/* 登录按钮 */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={{ borderColor: customColors.primary }}
              >
                {isRegister ? "注册/登录" : "登录"}
              </Button>
            </View>
            <View style={styles.agreementContainer}>
              {isRegister ? (
                <ThemedText style={styles.agreementText}>
                  若您已经有账号，请点击
                  <Pressable onPress={switchRegister}>
                    <ThemedText style={styles.linkText}>
                      " 登录账号 "
                    </ThemedText>
                  </Pressable>
                </ThemedText>
              ) : (
                <ThemedText style={styles.agreementText}>
                  若您还没有账号，请点击
                  <Pressable onPress={switchRegister}>
                    <ThemedText style={styles.linkText}>
                      " 注册账号 "
                    </ThemedText>
                  </Pressable>
                </ThemedText>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        {/* 用户协议与隐私政策 */}
        <View style={styles.agreementContainer}>
          <ThemedText style={styles.agreementText}>
            登录即表示您同意
            <Link
              href={{
                pathname: "/doc",
                params: {
                  name: "sqxy",
                },
              }}
              asChild
            >
              <ThemedText style={styles.linkText}>《用户协议》</ThemedText>
            </Link>
            和
            <Link
              href={{
                pathname: "/doc",
                params: {
                  name: "yszc",
                },
              }}
              asChild
            >
              <ThemedText style={styles.linkText}>《隐私政策》</ThemedText>
            </Link>
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: "#0f40f5",
    color: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  formCard: {
    marginBottom: 24,
    elevation: 2,
  },
  captchaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  captchaInput: {
    flex: 1,
  },
  captchaImageContainer: {
    width: 120,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  captchaImage: {
    width: 118,
    height: 46,
    borderRadius: 10,
  },
  captchaPlaceholder: {
    fontWeight: "500",
  },
  smsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  smsInput: {
    flex: 1,
  },
  smsButton: {
    minWidth: 120,
    borderRadius: 12,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  inviteCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  agreementContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  agreementText: {
    textAlign: "center",
    lineHeight: 18,
    fontSize: 14,
  },
  linkText: {
    fontWeight: "500",
    fontSize: 14,
    color: customColors.primary,
    textDecorationLine: "underline",
  },
});
