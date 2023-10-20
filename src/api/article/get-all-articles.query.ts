import { api } from '../client'

import type { IUser } from '@/interface/user'
import type { IArticle } from '@/interface/article'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResponsePaginated } from '@/interface'

export type GetAllArticlesResponse =
  ApiResponsePaginated<GetAllArticlesResponseData>

export interface GetAllArticlesResponseData extends IArticle {
  user: IUser
}

export interface MeQueryProps extends AxiosRequestConfig {}

export const getAllArticlesQuery = (props: MeQueryProps = {}) => {
  return api.get<GetAllArticlesResponse>('/articles', props)
}
