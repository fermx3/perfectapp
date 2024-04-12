import { z } from 'zod';

export const nivelesDeLeales = ['Básico', 'Oro', 'Platino'];
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

export const crearLealSchema = z
  .object({
    userId: z
      .string()
      .regex(/(\d)/, 'El usuario debe ser un número')
      .min(5, 'El numero de usuario debe ser de al menos 5 caracteres'),
    password: z
      .string()
      .min(8, 'La contraseña debe ser de al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Por favor confirma la contraseña'),
    nombre: z.string().min(1, 'Por favor introduce un nombre para el Leal'),
    nivelDeCliente: z.enum(nivelesDeLeales, {
      errorMap: (issue, ctx) => ({
        message: 'Por favor selecciona un nivel de cliente válido',
      }),
    }),
    role: z.enum(['LEAL']),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmPassword'],
  });

// export const clienteEnBaseSchema = z.object({
//   competidores: z.array(
//     z.object({
//       nombre: z.string().min(1),
//       productos: z
//         .array(
//           z.object({
//             gramos: z
//               .number({
//                 invalid_type_error: 'Gramos debe ser un numero',
//               })
//               .positive(),
//             precio: z
//               .number({
//                 invalid_type_error: 'Gramos debe ser un numero',
//               })
//               .positive(),
//             hasPromo: z.boolean(),
//           })
//         )
//         .optional(),
//     })
//   ),
//   comentarios1: z.string().min(1),
// });

// export const clienteEnBaseSchema2 = z.object({
//   promociones: z.array(
//     z.object({
//       promo: z.string(),
//       implementada: z.boolean(),
//     })
//   ),
//   cuentaConInventario: z.boolean(),
//   hayOrdenDeCompra: z.boolean(),
//   comentarios2: z.string().min(1),
// });

// export const clienteEnBaseSchema3 = z.object({
//   planDeComunicacion: z.array(
//     z.object({
//       materiales: z.string(),
//       alcance: z.boolean(),
//     })
//   ),
//   comentarios3: z.string().min(1),
// });

// const customErrorMap = (issue, ctx) => {
//   if (issue.code === z.ZodIssueCode.too_small) {
//     console.log(issue);
//     if (issue.type === 'string') {
//       return { message: 'Por favor rellena el campo' };
//     }
//   }
//   if (issue.code === z.ZodIssueCode.custom) {
//     return { message: `less-than-${(issue.params || {}).minimum}` };
//   }
//   return { message: ctx.defaultError };
// };

// z.setErrorMap(customErrorMap);
