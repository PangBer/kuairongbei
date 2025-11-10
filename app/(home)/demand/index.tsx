import LoginScreen from "@/app/login";
import DemandScreen from "@/components/pagesScreen/DemandScreen";
import { useAuth } from "@/store/hooks";
import { usePathname } from "expo-router";
import { useEffect } from "react";
export default () => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  // 初始化时检查认证状态，只在组件挂载时执行一次
  useEffect(() => {
    console.log(pathname);
  }, []); // 空依赖数组，只在组件挂载时执行
  return isAuthenticated ? <DemandScreen /> : <LoginScreen path={pathname} />;
};
