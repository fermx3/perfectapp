import { z } from 'zod';

export const nivelesDeLeales = ['Platinum', 'Oro', 'Plata', 'Otros'];
export const tiposDeCadena = ['si', 'no'];
export const tiposDeLeales = ['full', 'opcion2', 'opcion3'];
export const frecuencias = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
export const centrales = [
  'IZTAPALAPA',
  'MERCED',
  'ECATEPEC',
  'TOLUCA',
  'CHICOLOAPAN',
  'TECAMAC',
  'TLALNEPANTLA',
  'ATIZAPAN',
  'TULTITLAN',
];

export const canales = ['Cremerias', 'Abarrotes', 'Semillas', 'Reposteria'];

export const crearLealSchema = z
  .object({
    userId: z
      .string()
      .min(5, 'El numero de usuario debe ser de al menos 5 caracteres'),
    password: z
      .string()
      .min(8, 'La contraseña debe ser de al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Por favor confirma la contraseña'),
    role: z.enum(['LEAL', 'ASESOR', 'COORDINADOR', 'CLIENTE']),
    userInfo: z.object({
      nombre: z.string().min(1, 'Por favor introduce un nombre para el Leal'),
      nivelDeCliente: z.enum(nivelesDeLeales, {
        errorMap: (issue, ctx) => ({
          message: 'Por favor selecciona un nivel de cliente válido',
        }),
      }),
      cadena: z.enum(tiposDeCadena, {
        errorMap: (issue, ctx) => ({
          message: 'Por favor selecciona si es o no una cadena',
        }),
      }),
      leales: z.enum(tiposDeLeales, {
        errorMap: (issue, ctx) => ({
          message: 'Por favor selecciona el tipo de leal',
        }),
      }),
      frecuencia: z
        .enum(frecuencias, {
          errorMap: (issue, ctx) => ({
            message: 'Por favor selecciona una frecuencia',
          }),
        })
        .array()
        .nonempty(),
      asesorAsignado: z
        .string()
        .array()
        .nonempty({ message: 'Por favor selecciona un Asesor' }),
      central: z.enum(centrales, {
        errorMap: (issue, ctx) => ({
          message: 'Por favor selecciona un CEDAS',
        }),
      }),
      ubicacion: z.string().min(1, 'Por favor introduce una ubicación'),
      canal: z.enum(canales, {
        errorMap: (issue, ctx) => ({
          message: 'Por favor selecciona un canal',
        }),
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmPassword'],
  });

export const cambiarPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, 'La contraseña debe ser de al menos 8 caracteres'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe ser de al menos 8 caracteres'),
    confirmNewPassword: z
      .string()
      .min(8, 'La contraseña debe ser de al menos 8 caracteres'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmNewPassword'],
  });

export const actualizarDatosLealSchema = z.object({
  nombreDelEncargado: z.string().min(1, 'Por favor introduce un nombre'),
  email: z.string().email({ message: 'Por favor introduce un email válido' }),
  telefono: z
    .string()
    .regex(new RegExp('\\d'), 'Por favor escribe un número de telefono')
    .length(10, { message: 'El telefono debe ser de 10 dígitos' }),
  fechaDeAniversario: z.string().date('Por favor introduce una fecha válida'),
});

const customErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: 'Por favor rellena el campo' };
    }
  }
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'array') {
      return { message: 'Por favor selecciona al menos un asesor' };
    }
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `less-than-${(issue.params || {}).minimum}` };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
