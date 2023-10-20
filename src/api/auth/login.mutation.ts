import { api } from '../client'

import type { IUser } from '@/interface/user'
import type { ApiResponse } from '@/interface'
import type { AxiosRequestConfig } from 'axios'

export type LoginMutationResponse = ApiResponse<LoginMutationData>

export interface LoginMutationData {
  user: IUser
  token: string
}

export interface LoginMutationVariables {
  email: string
  password: string
}

export interface LoginMutationProps extends AxiosRequestConfig {
  body: LoginMutationVariables
}

export const loginMutation = ({ body, ...props }: LoginMutationProps) => {
  return api.post<LoginMutationResponse>('/auth/login', body, props)
}
