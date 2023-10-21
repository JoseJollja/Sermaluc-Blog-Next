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

export interface GetAllArticlesQueryProps extends AxiosRequestConfig {}

export const getAllArticlesQuery = async (
  props: GetAllArticlesQueryProps = {}
) => {
  return api
    .get<GetAllArticlesResponse>('/articles', props)
    .then((res) => res.data)
}
