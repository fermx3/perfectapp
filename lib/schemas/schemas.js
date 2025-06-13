import { z, ZodObject } from 'zod';

export const nivelesDeLeales = [
  'Platinum',
  'Oro',
  'Plata',
  'Otros',
  'No aplica',
  'Cuenta clave',
];
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

// export const regiones = [
//   { region: 'Guanajuato', centrales: ['León', 'Irapuato'] },
//   { region: 'Michoacán', centrales: ['Michoacán'] },
//   { region: 'Nuevo León', centrales: ['Monterrey'] },
//   { region: 'Puebla', centrales: ['Puebla'] },
//   {
//     region: 'CDMX',
//     centrales: [
//       'Iztapalapa',
//       'Ecatepec',
//       'Merced',
//       'Tlalnepantla',
//       'Atizapán',
//       'Tultitlan',
//     ],
//   },
// ];

// export const centrales = [
//   'León',
//   'Irapuato',
//   'Michoacán',
//   'Monterrey',
//   'Puebla',
//   'Iztapalapa',
//   'Ecatepec',
//   'Merced',
//   'Tlalnepantla',
//   'Atizapán',
//   'Tultitlan',
// ];

export const canales = [
  'Cremerias',
  'Abarrotes',
  'Chiles y semillas',
  'Repostería',
  'Recaudería',
  'Dulcería',
  'Mayorista',
  'Otros',
];

export const cortinasOptions = ['1', '2', '3', 'Más de 3'];

export const personasQueAtiendenOptions = [
  '1 a 3',
  '3 a 7',
  '7 a 10',
  'Más de 10',
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
      central: z.string().min(1, 'Por favor selecciona un CEDAS'),
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
  central: z.string().min(1, 'Por favor selecciona un CEDAS'),
  region: z.string().min(1, 'Por favor selecciona un CEDAS'),
  nombre: z.string().min(1, 'Por favor introduce un nombre'),
  // nivelDeCliente: z.enum(nivelesDeLeales, {
  //   errorMap: (issue, ctx) => ({
  //     message: 'Por favor selecciona un nivel de cliente válido',
  //   }),
  // }),
  ubicacion: z.string().min(1, 'Por favor introduce una ubicación'),
  canal: z.enum(canales, {
    errorMap: (issue, ctx) => ({
      message: 'Por favor selecciona un canal',
    }),
  }),
  cortinas: z.enum(cortinasOptions, {
    errorMap: (issue, ctx) => ({
      message: 'Por favor selecciona un número de cortinas',
    }),
  }),
  personasQueAtienden: z.enum(personasQueAtiendenOptions, {
    errorMap: (issue, ctx) => ({
      message: 'Por favor selecciona un número de personas que atienden',
    }),
  }),
  mantequilla: z.boolean(),
  margarina: z.boolean(),
  refrigeracion: z.boolean(),
  productosInstitucionales: z.boolean(),
  tienenPasillos: z.boolean(),
  tienenMostrador: z.boolean(),
  perteneceAGrupo: z.boolean(),
  grupo: z
    .string({
      invalid_type_error: 'Por favor introduce texto',
    })
    .optional(),
  comentarios: z.string({
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
  fechaInicio: z.string().date('Por favor introduce una fecha válida'),
  fechaFin: z.string().date('Por favor introduce una fecha válida'),
  base: z.enum(['ventas', 'precios', 'inventario'], {
    errorMap: (issue, ctx) => ({
      message: 'Por favor selecciona una base de datos',
    }),
  }),
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

export const cambiarValorDePuntosSchema = z.record(
  z.record(
    z.string(),
    z
      .number({
        invalid_type_error: 'Por favor introduce un número',
      })
      .min(0, 'Por favor introduce un número válido')
  )
);

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

export const aceptarTyCSchema = z.object({
  aceptoTyC: z.boolean().refine((data) => data === true, {
    message: 'Por favor acepta los términos y condiciones',
  }),
});

export const validarProspectoSchema = z
  .object({
    nombre: z.string().min(1, 'Por favor introduce un nombre'),
    canal: z.enum(canales, {
      errorMap: (issue, ctx) => ({
        message: 'Por favor selecciona un canal',
      }),
    }),
    central: z.string().min(1, 'Por favor selecciona un CEDAS'),
    ubicacion: z.string().min(1, 'Por favor introduce una ubicación'),
    grupo: z.string().optional(),
    nivelDeCliente: z.enum(nivelesDeLeales, {
      errorMap: (issue, ctx) => ({
        message: 'Por favor selecciona un nivel de cliente válido',
      }),
    }),
    zona: z.string().min(1, 'Por favor introduce una zona'),
    frecuencia: z.record(z.string(), z.boolean()),
    cuota: z.record(z.string(), z.number()),
    id: z.string(),
  })
  .refine((data) => Object.values(data.frecuencia).includes(true), {
    message:
      'Por favor selecciona al menos un día de la semana en el que se visitará al cliente',
    path: ['frecuencia'],
  });

export const actualizarBannersSchema = z.object({
  bannersLeales: z
    .array(
      z.object({
        _id: z.string().optional(),
        titulo: z.string().min(1, 'Por favor introduce un titulo'),
        alt: z.string().min(1, 'Por favor introduce una descripción'),
        src: z.string().min(1, 'Por favor introduce una imagen'),
        href: z.optional(z.string()),
        empresa: z.string().optional(),
        locked: z.boolean().optional(),
        requisitosToShow: z.optional(z.record(z.string(), z.boolean())),
      })
    )
    .superRefine((banners, ctx) => {
      const titles = new Set();
      banners.forEach((banner, index) => {
        if (titles.has(banner.titulo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El título está repetido',
            path: [index, 'titulo'],
          });
        } else {
          titles.add(banner.titulo);
        }
      });
    }),
});

const customErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: 'Por favor rellena el campo' };
    }
  }
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'array') {
      return { message: 'Por favor rellena el campo' };
    }
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `less-than-${(issue.params || {}).minimum}` };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
