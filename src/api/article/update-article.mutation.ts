import { api } from '../client'

import type { ApiResponse } from '@/interface'
import type { AxiosRequestConfig } from 'axios'
import type { IArticle } from '@/interface/article'

export type UpdateArticleMutationResponse = ApiResponse<IArticle>
export interface UpdateArticleMutationVariables {
  title: string
  content: string
}

export interface UpdateArticleMutationProps extends AxiosRequestConfig {
  id: string
  body: UpdateArticleMutationVariables
}

export const updateArticleMutation = async ({
  id,
  body,
  ...props
}: UpdateArticleMutationProps) => {
  return api
    .put<UpdateArticleMutationResponse>(`/articles/${id}`, body, props)
    .then((res) => res.data)
}
