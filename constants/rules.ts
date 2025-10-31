// 验证规则
export const validationRules = {
  name: {
    required: "请输入姓名",
  },
  phone: {
    required: "请输入联系电话",
    pattern: {
      value: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
    },
  },
  idcard: {
    required: "请输入身份证",
    pattern: {
      value:
        /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
      message: "请输入正确的身份证",
    },
  },
  age: {
    pattern: {
      value: /^2[2-9]|[3-4][0-9]|5[0-5]$/,
      message: "年龄须在22至55范围内",
    },
  },
  amount: {
    required: "请输入需求金额",
    pattern: {
      value: /^[1-9]\d*$/,
      message: "请输入正整数",
    },
    validate: (value: string) => {
      const num = parseInt(value);
      if (num < 5000) {
        return "需求金额不能低于5000";
      }
      return true;
    },
  },
  personMonthIncome: {
    pattern: {
      value: /^[1-9]\d*$/,
      message: "请输入正整数",
    },
  },
};
// 基本信息
export const Options1 = [
  {
    label: "姓名",
    prop: "name",
    type: "text",
  },
  {
    label: "联系电话",
    prop: "phone",
    type: "number",
    maxlength: 11,
  },
  {
    label: "身份证",
    prop: "idcard",
    type: "text",
  },
  {
    label: "性别",
    prop: "sex",
    type: "select",
    dict: "sys_user_sex",
  },

  {
    label: "年龄",
    prop: "age",
    type: "number",
  },
  {
    label: "贷款地",
    prop: "city",
    type: "levelSelect",
    dict: "citys_collect",
    props: {
      text: "name",
      value: "id",
      children: "children",
    },
  },
];
// 需求信息
export const Options2 = [
  {
    label: "职业身份",
    prop: "occupation",
    type: "select",
    dict: "crm_career",
    scoreType: -1,
    haveAcore: {
      "1": 10,
      "2": 10,
      "3": 15,
      "4": 20,
      "5": 10,
    },
  },
  {
    label: "芝麻分",
    prop: "personSesameScore",
    type: "select",
    dict: "alipay_sesame_seed",
    scoreType: -1,
    haveAcore: {
      "2": 10,
      "3": 10,
      "4": 10,
      "5": 20,
    },
  },
  {
    label: "信用情况",
    prop: "credit",
    type: "select",
    dict: "crm_credit",
    scoreType: -1,
    haveAcore: {
      "2": 5,
      "3": 10,
    },
  },
  {
    label: "打卡工资(元)",
    prop: "personMonthIncome",
    type: "number",
    scoreType: -1,
    scoreLevel: {
      "2": "3500-7999",
      "3": "8000-9999",
      "4": "10000-19999",
      "5": "20000",
    },
    haveAcore: {
      "2": 10,
      "3": 20,
      "4": 30,
      "5": 40,
    },
  },
  {
    label: "需求金额(元)",
    prop: "amount",
    type: "number",
    scoreType: -1,
    scoreLevel: {
      "1": "10000-49999",
      "2": "50000-199999",
      "3": "200000",
    },
    haveAcore: {
      "1": 10,
      "2": 20,
      "3": 30,
    },
  },
];
// 资质信息
export const Options4 = [
  {
    label: "名下有房",
    prop: "personHouse",
    type: "checkbox",
    scoreType: -1,
    haveAcore: 20,
  },
  {
    label: "名下有车",
    prop: "personCar",
    type: "checkbox",
    scoreType: -1,
    haveAcore: 20,
  },
  {
    label: "社保缴纳半年以上",
    prop: "socialSecurity",
    type: "checkbox",
    scoreType: -1,
    haveAcore: 10,
  },
  {
    label: "公积金缴纳半年以上",
    prop: "accumulationFund",
    type: "checkbox",
    scoreType: -1,
    haveAcore: 10,
  },
  {
    label: "保险保单有效半年以上",
    prop: "insurancePolicy",
    type: "checkbox",
    scoreType: -1,
    haveAcore: 10,
  },
];

export const Options5 = [
  {
    label: "芝麻分",
    prop: "personSesameScoreFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 20,
    file: ["https://ryr123.com/app_resources/static/image/gather-zhimafen.png"],
  },

  {
    label: "房产信息",
    prop: "personHouseFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 100,
    file: ["https://ryr123.com/app_resources/static/image/gather-fangchan.png"],
  },
  {
    label: "车产信息",
    prop: "personCarFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 50,
  },
  {
    label: "公积金",
    prop: "personProvidentFundFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 100,
    file: [
      "https://ryr123.com/app_resources/static/image/gather-gongjijin.png",
    ],
  },
  {
    label: "社保",
    prop: "socialSecurityFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 50,
    file: ["https://ryr123.com/app_resources/static/image/gather-shebao.png"],
  },
  {
    label: "企业主",
    prop: "companyFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 50,
    file: [
      "https://ryr123.com/app_resources/static/image/gather-yingyezhizhao1.png",
      "https://ryr123.com/app_resources/static/image/gather-yingyezhizhao2.png",
      "https://ryr123.com/app_resources/static/image/gather-yingyezhizhao3.png",
    ],
  },

  {
    label: "保单证明",
    prop: "personGuaranteeSlipFile",
    type: "upload",
    scoreType: -1,
    haveAcore: 30,
  },
];

export const gradeScore = {
  0: 3,
  1: 2,
  2: 1.5,
  3: 1,
  4: 1,
  5: 1,
};

export const uploadKeys = [
  "personSesameScoreFile",
  "huabeiFile",
  "baitiaoFile",
  "personHouseFile",
  "personCarFile",
  "personProvidentFundFile",
  "socialSecurityFile",
  "companyFile",
  "stateEnterpriseFile",
  "personCreditFile",
  "personGuaranteeSlipFile",
];

export const passone = ["personSesameScore", "credit"];
export const passzero = [
  "socialSecurity",
  "accumulationFund",
  "personHouse",
  "insurancePolicy",
  "personCar",
  "purpose",
  "deadline",
  "education",
  "occupation",
  "seniority",
  "area",
];
