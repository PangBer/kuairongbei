// 选择器相关的工具函数

export interface SelectOption {
  id?: string;
  name?: string;
  dictCode?: string;
  dictLabel?: string;
  children?: SelectOption[];
  [key: string]: any;
}

// 获取选项的显示名称
export const getOptionName = (option: SelectOption): string => {
  return option.label || option.dictLabel || "";
};

// 获取选项的ID
export const getOptionId = (option: SelectOption): string => {
  return option.value || option.dictCode || "";
};

// 查找选项
export const findOptionById = (
  options: SelectOption[],
  id: string
): SelectOption | undefined => {
  return options.find((option) => getOptionId(option) === id);
};

// 构建选项路径（用于多级选择）
export const buildOptionPath = (
  options: SelectOption[],
  targetId: string
): SelectOption[] => {
  const path: SelectOption[] = [];

  const findPath = (opts: SelectOption[]): boolean => {
    for (const option of opts) {
      if (getOptionId(option) === targetId) {
        path.push(option);
        return true;
      }
      if (option.children?.length) {
        path.push(option);
        if (findPath(option.children)) return true;
        path.pop();
      }
    }
    return false;
  };

  findPath(options);
  return path;
};

// 获取选项路径的显示文本
export const getPathDisplayText = (path: SelectOption[]): string => {
  return path.map(getOptionName).join(" - ");
};

// 根据路径获取父级选项
export const getParentOptions = (
  options: SelectOption[],
  path: SelectOption[]
): SelectOption[] => {
  if (path.length === 0) return options;

  let currentOptions = options;
  for (let i = 0; i < path.length - 1; i++) {
    const parent = currentOptions.find(
      (opt) => getOptionId(opt) === getOptionId(path[i])
    );
    if (parent?.children) {
      currentOptions = parent.children;
    }
  }
  return currentOptions;
};
