import { api } from '../client'

import type { IUser } from '@/interface/user'
import type { ApiResponse } from '@/interface'
import type { AxiosRequestConfig } from 'axios'

export type MeQueryResponse = ApiResponse<IUser>

export interface MeQueryProps extends AxiosRequestConfig {}

export const meQuery = async (props: MeQueryProps = {}) => {
  return api.get<MeQueryResponse>('/auth/me', props).then((res) => res.data)
}
