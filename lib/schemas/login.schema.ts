import { z } from "zod"

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
