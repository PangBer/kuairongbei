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
