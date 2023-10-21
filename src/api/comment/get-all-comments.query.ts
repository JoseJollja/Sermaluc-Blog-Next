import { api } from '../client'

import type { AxiosRequestConfig } from 'axios'
import type { IComment } from '@/interface/comment'
import type { ApiResponsePaginated } from '@/interface'

export type GetAllCommentsQueryResponse = ApiResponsePaginated<IComment>

export interface GetAllCommentsQueryProps extends AxiosRequestConfig {
  params?: {
    filters: {
      articleId: string
    }
  }
}

export const getAllCommentsQuery = async (
  props: GetAllCommentsQueryProps = {}
) => {
  return api
    .get<GetAllCommentsQueryResponse>('/comments', props)
    .then((res) => res.data)
}
