import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearLealSchema = z
  .object({
    userId: z
      .string()
      .min(5, 'El numero de usuario debe ser de al menos 5 caracteres'),
    password: z
      .string()
      .min(8, 'La contraseña debe ser de al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Por favor confirma la contraseña'),
    nombre: z.string().min(1, 'Por favor introduce un nombre para el Leal'),
    nivelDeCliente: z
      .string()
      .min(1, 'Por favor, selecciona un nivel de cliente'),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmPassword'],
  });
