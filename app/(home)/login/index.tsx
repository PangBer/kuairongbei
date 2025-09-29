import { imageCodeApi, sendLoginAPi, smsCodeApi, userInfoApi } from "@/service";
import { useAuthActions, useToastActions } from "@/store/hooks";
import { setToken } from "@/utils/token";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  HelperText,
  TextInput,
  Text as TextPaper,
} from "react-native-paper";

// 表单数据类型
interface LoginFormData {
  phone: string;
  code: string;
  smsCode: string;
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
export default function LoginScreen() {
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { login } = useAuthActions();
  const { showInfo } = useToastActions();
  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<LoginFormData>({
    mode: "onBlur",
    defaultValues: {
      phone: "",
      code: "",
      smsCode: "",
    },
  });

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
        phone: watch("phone"),
        code: watch("code"),
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 标题区域 */}
        <View style={styles.headerContainer}>
          <TextPaper variant="headlineMedium" style={styles.title}>
            快融呗
          </TextPaper>
          <TextPaper variant="bodyLarge" style={styles.subtitle}>
            手机号账号登录
          </TextPaper>
        </View>

        <Card style={styles.formCard}>
          <Card.Content>
            {/* 登录账号 */}
            <View style={styles.inputContainer}>
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
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.phone}>
                      {errors?.phone?.message as string}
                    </HelperText>
                  </>
                )}
              />
            </View>

            {/* 图像验证码 */}
            <View style={styles.inputContainer}>
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
                      style={[styles.input, styles.captchaInput]}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.captchaImageContainer}
                  onPress={getImageCaptcha}
                  activeOpacity={0.7}
                >
                  {imageCaptchaLoading ? (
                    <ActivityIndicator size="small" />
                  ) : captchaImage ? (
                    <Image
                      source={{ uri: captchaImage }}
                      style={styles.captchaImage}
                    />
                  ) : (
                    <TextPaper
                      variant="bodySmall"
                      style={styles.captchaPlaceholder}
                    >
                      点击获取
                    </TextPaper>
                  )}
                </TouchableOpacity>
              </View>
              <HelperText type="error" visible={!!errors.code}>
                {errors?.code?.message as string}
              </HelperText>
            </View>

            {/* 短信验证码 */}
            <View style={styles.inputContainer}>
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
                      style={[styles.input, styles.smsInput]}
                    />
                  )}
                />
                <Button
                  mode="outlined"
                  onPress={getSmsCode}
                  disabled={smsCountdown > 0 || smsLoading}
                  loading={smsLoading}
                  style={[styles.smsButton]}
                >
                  {smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码"}
                </Button>
              </View>
              <HelperText type="error" visible={!!errors.smsCode}>
                {errors?.smsCode?.message as string}
              </HelperText>
            </View>

            {/* 登录按钮 */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
              >
                登录
              </Button>
            </View>

            {/* 用户协议与隐私政策 */}
            <View style={styles.agreementContainer}>
              <TextPaper variant="bodySmall" style={styles.agreementText}>
                登录即表示您同意
                <Link href="/doc?url=https://ryr123.com/app_resources/sqxy.docx&type=docx&showAgreement=true&title=用户协议">
                  <TextPaper variant="bodySmall" style={styles.linkText}>
                    《用户协议》
                  </TextPaper>
                </Link>
                和
                <Link href="/doc?url=https://ryr123.com/app_resources/yszc.docx&type=docx&showAgreement=true&title=隐私政策">
                  <TextPaper variant="bodySmall" style={styles.linkText}>
                    《隐私政策》
                  </TextPaper>
                </Link>
              </TextPaper>
            </View>
          </Card.Content>
        </Card>
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
  },
  formCard: {
    marginBottom: 24,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
  },
  captchaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  captchaInput: {
    flex: 1,
    backgroundColor: "#fff",
  },
  captchaImageContainer: {
    width: 120,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  captchaImage: {
    width: 118,
    height: 46,
    borderRadius: 10,
  },
  captchaPlaceholder: {
    color: "#6c757d",
    fontWeight: "500",
  },
  smsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  smsInput: {
    flex: 1,
    backgroundColor: "#fff",
  },
  smsButton: {
    minWidth: 120,
    borderRadius: 12,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: "#1976D2",
  },
  agreementContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  agreementText: {
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    color: "#1976D2",
    fontWeight: "500",
  },
});
