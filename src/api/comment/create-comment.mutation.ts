import { api } from '../client'

import type { ApiResponse } from '@/interface'
import type { IComment } from '@/interface/comment'
import type { AxiosRequestConfig } from 'axios'

export type CreateCommentMutationResponse = ApiResponse<IComment>

export interface CreateCommentMutationVariables {
  content: string
  articleId: string
}

export interface CreateCommentMutationProps extends AxiosRequestConfig {
  body: CreateCommentMutationVariables
}

export const createCommentMutation = ({
  body,
  ...props
}: CreateCommentMutationProps) => {
  return api.post<CreateCommentMutationResponse>('/comments', body, props)
}
