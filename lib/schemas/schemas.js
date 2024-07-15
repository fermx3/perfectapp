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
  'OTRO',
];

export const canales = [
  'Cremería',
  'Abarrotes',
  'Chiles y semillas',
  'Repostería',
  'Recaudería',
];

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

export const emailSchema = z.object({
  email: z.string().email({ message: 'Por favor introduce un email válido' }),
});

export const clienteNuevoSchema = z.object({
  nombre: z.string().min(1, 'Por favor introduce un nombre'),
  nivelDeCliente: z.enum(nivelesDeLeales, {
    errorMap: (issue, ctx) => ({
      message: 'Por favor selecciona un nivel de cliente válido',
    }),
  }),
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
  comentarios: z.string({
    invalid_type_error: 'Por favor introduce texto',
  }),
  grupo: z.string({
    invalid_type_error: 'Por favor introduce texto',
  }),
});

export const contactoSchema = z.object({
  nombre: z.string().min(1, 'Por favor introduce un nombre'),
  email: z.string().email({ message: 'Por favor introduce un email válido' }),
  telefono: z
    .string()
    .regex(new RegExp('\\d'), 'Por favor escribe un número de telefono')
    .length(10, { message: 'El telefono debe ser de 10 dígitos' }),
  empresa: z.string().min(1, 'Por favor introduce una ubicación'),
  ubicacion: z.string().min(1, 'Por favor introduce tu ubicación'),
  giro: z.string().min(1, 'Por favor introduce el giro de tu empresa'),
  necesidad: z
    .string()
    .min(1, 'Por favor introduce la necesidad de tu empresa'),
});

export const filtrarBaseSchema = z.object({
  fechaInicio: z
    .string()
    .date('Por favor introduce una fecha válida')
    .optional()
    .or(z.literal('')),
  fechaFin: z
    .string()
    .date('Por favor introduce una fecha válida')
    .optional()
    .or(z.literal('')),
  cliente: z
    .string({ invalid_type_error: 'Por favor introduce texto' })
    .optional()
    .or(z.literal('')),
  central: z
    .string({ invalid_type_error: 'Por favor introduce texto' })
    .optional(),
  userID: z.string(),
});
// .refine(
//   (data) =>
//     data.fechaFin !== '' ||
//     data.fechaInicio !== '' ||
//     data.fechaFin > data.fechaFin,
//   {
//     message: 'La fecha de inicio debe ser menor a la fecha de fin',
//     path: ['fechaFin'],
//   }
// );

export const actualizarMensajesSchema = z.object({
  infoDeCategoria: z.object({
    titulo: z
      .string({ invalid_type_error: 'Por favor introduce texto' })
      .optional(),
    contenido: z
      .string({ invalid_type_error: 'Por favor introduce texto' })
      .optional(),
  }),
  infoDeComunicacion: z.object({
    titulo: z
      .string({ invalid_type_error: 'Por favor introduce texto' })
      .optional(),
    contenido: z
      .string({ invalid_type_error: 'Por favor introduce texto' })
      .optional(),
  }),
  infoDeFidelizacion: z.object({
    titulo: z
      .string({ invalid_type_error: 'Por favor introduce texto' })
      .optional(),
    contenido: z
      .string({ invalid_type_error: 'Por favor introduce texto' })
      .optional(),
  }),
});

// export const actualizarPromocionesSchema = z.array(
//   z.object({
//     promo: z.string().min(1, 'Por favor introduce una promoción'),
//     nivelDeCliente: z.object({
//       name: z.string(),
//       selected: z.boolean(),
//     }),
//     sku: z.string().min(1, 'Por favor introduce un SKU'),
//   })
// );

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
