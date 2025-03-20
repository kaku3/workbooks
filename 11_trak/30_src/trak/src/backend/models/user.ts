import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
});

export const UsersConfigSchema = z.object({
  users: z.array(UserSchema)
});

export type User = z.infer<typeof UserSchema>;
export type UsersConfig = z.infer<typeof UsersConfigSchema>;
