export interface IUser {
  email: string
  name: string
  lastname: string
  rol: string
  status: string
  createdAt: Date
  updatedAt: Date
  __v: number
  id: string
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}
