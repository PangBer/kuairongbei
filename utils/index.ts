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
