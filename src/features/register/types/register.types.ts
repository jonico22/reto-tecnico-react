export interface RegisterFormData {
  documentType: 'dni' | 'ce';
  documentNumber: string;
  cellphone: string;
  privacyPolicy: boolean;
  commercialComms: boolean;
}

export interface UserServiceResponse {
  name:     string;
  lastName: string;
  birthDay: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;