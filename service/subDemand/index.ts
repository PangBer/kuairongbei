import req from "@/utils/fetch";
// 表单数据类型
export interface DemandFormData {
  id?: string;
  phone?: string;
  name?: string;
  idcard?: string;
  personHouse?: string;
  personHouseFile?: any;
  personCar?: string;
  personCarFile?: any;
  socialSecurity?: string;
  socialSecurityFile?: any;
  accumulationFund?: string;
  personProvidentFundFile?: any;
  insurancePolicy?: string;
  personGuaranteeSlipFile?: any;
  occupation?: string;
  companyFile?: any;
  income?: string;
  personSesameScore?: string;
  personSesameScoreFile?: any;
  credit?: string;
  amount?: any;
  city?: string;
}

export class DemandFormDataImpl implements DemandFormData {
  id?: string;
  phone?: string;
  name?: string;
  idcard?: string;
  personHouse?: string;
  personHouseFile?: any;
  personCar?: string;
  personCarFile?: any;
  socialSecurity?: string;
  socialSecurityFile?: any;
  accumulationFund?: string;
  personProvidentFundFile?: any;
  insurancePolicy?: string;
  personGuaranteeSlipFile?: any;
  occupation?: string;
  companyFile?: any;
  income?: string;
  personSesameScore?: string;
  personSesameScoreFile?: any;
  credit?: string;
  amount?: any;
  city?: string;
  constructor(data?: DemandFormData) {
    if (data) {
      this.id = data.id;
      this.phone = data.phone;
      this.name = data.name;
      this.idcard = data.idcard;
      this.personHouse = data.personHouse;
      this.personHouseFile = data.personHouseFile;
      this.personCar = data.personCar;
      this.personCarFile = data.personCarFile;
      this.socialSecurity = data.socialSecurity;
      this.socialSecurityFile = data.socialSecurityFile;
      this.accumulationFund = data.accumulationFund;
      this.personProvidentFundFile = data.personProvidentFundFile;
      this.insurancePolicy = data.insurancePolicy;
      this.personGuaranteeSlipFile = data.personGuaranteeSlipFile;
      this.occupation = data.occupation;
      this.companyFile = data.companyFile;
      this.income = data.income;
      this.personSesameScore = data.personSesameScore;
      this.personSesameScoreFile = data.personSesameScoreFile;
      this.credit = data.credit;
      this.amount = data.amount;
      this.city = data.city;
    }
  }
}

export const propScoreMap: any = {
  personHouse: {
    score: 20,
  },
  personHouseFile: {
    score: 100,
  },
  personCar: {
    score: 20,
  },
  personCarFile: {
    score: 50,
  },
  socialSecurity: {
    score: 10,
  },
  socialSecurityFile: {
    score: 50,
  },
  accumulationFund: {
    score: 10,
  },
  personProvidentFundFile: {
    score: 100,
  },
  insurancePolicy: {
    score: 10,
  },
  personGuaranteeSlipFile: {
    score: 30,
  },
  occupation: {
    score: {
      "1": 10,
      "2": 10,
      "3": 15,
      "4": 20,
      "5": 10,
    },
  },
  companyFile: {
    score: 50,
  },
  income: {
    scoreLevel: {
      "1": {
        min: 3500,
        max: 7999,
      },
      "2": {
        min: 8000,
        max: 9999,
      },
      "3": {
        min: 10000,
        max: 19999,
      },
      "4": {
        min: 20000,
        max: Infinity,
      },
    },
    score: {
      "1": 10,
      "2": 20,
      "3": 30,
      "4": 40,
    },
  },
  personSesameScore: {
    score: {
      "2": 10,
      "3": 10,
      "4": 10,
      "5": 20,
    },
  },
  personSesameScoreFile: {
    score: 20,
  },
  credit: {
    score: {
      "2": 5,
      "3": 10,
    },
  },
  amount: {
    scoreLevel: {
      "1": {
        min: 10000,
        max: 49999,
      },
      "2": {
        min: 50000,
        max: 199999,
      },
      "3": {
        min: 200000,
        max: Infinity,
      },
    },
    score: {
      "1": 10,
      "2": 20,
      "3": 30,
    },
  },
};

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
  "personHouseFile",
  "personCarFile",
  "personProvidentFundFile",
  "socialSecurityFile",
  "companyFile",
  "personCreditFile",
];

export const passone = ["personSesameScore", "credit"];

export const passzero = [
  "personHouse",
  "personCar",
  "socialSecurity",
  "accumulationFund",
  "insurancePolicy",
  "occupation",
];

// 验证规则
export const validationRules = {
  name: {
    required: "请输入真实姓名",
  },
  idcard: {
    required: "请输入身份证",
    pattern: {
      value:
        /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
      message: "请输入正确的身份证",
    },
  },
  city: {
    required: "请选择贷款地",
  },
  amount: {
    required: "请输入需求金额",
    min: {
      value: 1000,
      message: "请输入正确的金额,最小金额为1000元",
    },
    max: {
      value: 1000000,
      message: "请输入正确的金额,最大金额为1000000元",
    },
  },
};

export const submitDemandSave = async (data: DemandFormData) => {
  return req.post("/h5/infoRecord/save", data);
};

export const getDemandDetail = async () => {
  return req.get(`/h5/infoRecord/recentRecode`);
};

export const submitDemandToCommit = async (data: DemandFormData) => {
  return req.post("/h5/infoRecord/customerToCommit", data);
};
