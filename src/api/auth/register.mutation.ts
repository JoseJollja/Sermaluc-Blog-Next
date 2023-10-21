import { api } from '../client'

import type { ApiResponse } from '@/interface'
import type { AxiosRequestConfig } from 'axios'
import type { IUser, UserRole, UserStatus } from '@/interface/user'

export type RegisterMutationResponse = ApiResponse<RegisterMutationData>

export interface RegisterMutationData {
  user: IUser
  token: string
}

export interface RegisterMutationVariables {
  name: string
  email: string
  lastname: string
  password: string
  rol: UserRole
  status: UserStatus
}

export interface RegisterMutationProps extends AxiosRequestConfig {
  body: RegisterMutationVariables
}

export const registerMutation = ({ body, ...props }: RegisterMutationProps) => {
  return api.post<RegisterMutationResponse>('/auth/register', body, props)
}
