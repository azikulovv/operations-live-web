import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string('Введите email').min(1, 'Введите email').email('Введите корректный email'),
  password: z.string('Введите пароль').min(1, 'Введите пароль'),
})

export type SignInSchema = z.infer<typeof signInSchema>
