/**
 *
 * @param list 城市列表
 * @returns  格式化城市列表
 */
export const cityformatData = (list: any[]): any[] => {
  return list.map((e: any) => ({
    ...e,
    label: e.name,
    value: e.code,
    children:
      e.children && e.children?.length ? cityformatData(e.children) : undefined,
  }));
};

/**
 *
 * @param list 城市列表
 * @param code 城市code
 * @param l 递归深度
 * @returns 城市等级
 */

export const getCitygGrade = (
  list: any[],
  code: string,
  l = 2
): 0 | 1 | 2 | 3 | 4 | 5 => {
  if (code) {
    const i = list?.findIndex(
      (e) => e.code === code || e.code.startsWith(code.slice(0, l))
    );
    if (i == -1) return 5;
    if (list[i].code === code) {
      return list[i].grade;
    } else {
      return getCitygGrade(list[i].children, code, l * 2);
    }
  } else {
    return 5;
  }
};

let currentPath = "/";

export function setCurrentPath(path: string) {
  currentPath = path;
}

export function getCurrentPath() {
  return currentPath;
}

// 格式化时间
export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    // 今天
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  } else if (diffDays === 1) {
    // 昨天
    return "昨天";
  } else if (diffDays < 7) {
    // 一周内
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekdays[date.getDay()];
  } else {
    // 其他日期
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};
