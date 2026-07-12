import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: z
    .string()
    .min(3, 'Le mot de passe doit contenir au moins 3 caractères'),
});


