export const UserRoles = {
  manager: 'MANAGER',
  admin: 'ADMIN',
  hostess: 'HOSTESS',
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]

export const UserRoleLabels: Record<UserRole, string> = {
  MANAGER: 'Управляющий',
  ADMIN: 'Админ',
  HOSTESS: 'Хостес',
}

export type AuthUser = {
  id: string
  email: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export type SignInResponse = {
  accessToken: string
  user: AuthUser
}
