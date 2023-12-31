import { api } from '../client'

import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/interface'
import type { IArticle } from '@/interface/article'
import type { IUser } from '@/interface/user'
import { IUpload } from '@/interface/upload'

export type GetArticleByIDResponse = ApiResponse<
  IArticle & { user?: IUser; photo?: IUpload }
>

export interface GetArticleByIDQueryProps extends AxiosRequestConfig {
  id: string
}

export const getArticleByIDQuery = async ({
  id,
  ...props
}: GetArticleByIDQueryProps) => {
  return api
    .get<GetArticleByIDResponse>(`/articles/${id}`, props)
    .then((res) => res.data)
}
