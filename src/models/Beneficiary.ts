interface Beneficiary {
  id: string;
  nickName: string;
  fullName: string;
  accountNumber: string;
  bankInfo: BankInfo;
  address: Address;
  phoneNumber: string;
  email: string;
  notificationEnabled: boolean | null | undefined;
  createdBy: string | null | undefined;
  userId: string | null | undefined;
  [key: string]: any; // Add an index signature
}

interface BankInfo {
  // Define bank information properties
  bankName: string;
  swiftCode: string;
  branchName: string;
  branchAddress: string;
}

interface Country {
  // Define country properties
  name: string;
  code: string;
}
interface Address {
  // Define Adress properties
  country: string;
  street: string;
}
interface CreateFormData {
  nickName: string;
  fullName: string;
  accountNumber: string;
  phoneNumber: string;
  email: string;
  // bankInfo: BankInfo;
  // address: Address;
  country: string;
  street: string;
  bankName: string;
  swiftCode: string;
  branchName: string;
  branchAddress: string;
}

export enum Countries {
  USA = "+1",
  CANADA = "+2",
  UK = "+44",
  GERMANY = "+49",
  FRANCE = "+33",
}

export type { Beneficiary, BankInfo, Country, CreateFormData };
