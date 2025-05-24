import { z } from 'zod';

export const RegisterFormSchema = z.object({
  documentType: z.enum(['dni', 'ce'], { required_error: 'Tipo de documento es requerido.' }),
  documentNumber: z.string()
    .min(8, 'Número de documento minimo debe tener 8 digitos.')
    .max(8, 'Número de documento no puede tener más de 8 dígitos.')
    .regex(/^[0-9]+$/, 'Solo se permiten números.'),
  cellphone: z.string().min(1, 'Celular es requerido.').regex(/^[0-9]{9}$/, 'Celular debe tener 9 dígitos.'),
  privacyPolicy: z.boolean().refine((val) => val === true, { message: 'Debes aceptar la Política de Privacidad.' }),
  commercialComms: z.boolean().refine((val) => val === true, { message: 'Debes aceptar la Política de Comunicaciones.' }),
});

export type RegisterFormData = {
  documentType: string;
  documentNumber: string;
  cellphone: string;
  privacyPolicy: boolean;
  commercialComms: boolean;
};

export type RegisterFormErrors = {
  [K in keyof RegisterFormData]?: string;
};