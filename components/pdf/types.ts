const Sqxy = require("@/assets/file/sqxy.pdf");
const Yszc = require("@/assets/file/yszc.pdf");
export type ValueType = {
  [key: string]: any;
};
export const NameValue: ValueType = {
  sqxy: "用户协议",
  yszc: "隐私政策",
};

export const PdfMap: ValueType = {
  sqxy: Sqxy,
  yszc: Yszc,
};
