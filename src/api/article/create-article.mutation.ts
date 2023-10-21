import { api } from '../client'

import type { ApiResponse } from '@/interface'
import type { AxiosRequestConfig } from 'axios'
import type { IArticle } from '@/interface/article'

export type CreateArticleMutationResponse = ApiResponse<IArticle>
export interface CreateArticleMutationVariables {
  title: string
  content: string
  photoId: string
}

export interface CreateArticleMutationProps extends AxiosRequestConfig {
  body: CreateArticleMutationVariables
}

export const createArticleMutation = async ({
  body,
  ...props
}: CreateArticleMutationProps) => {
  return api
    .post<CreateArticleMutationResponse>('/articles', body, props)
    .then((res) => res.data)
}
