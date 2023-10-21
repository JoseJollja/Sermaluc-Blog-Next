import { ApiResponse } from '@/interface'
import { IUpload } from '@/interface/upload'
import { AxiosRequestConfig } from 'axios'
import { api } from '../client'

export type CreateUploadResponse = ApiResponse<IUpload>
export interface CreateUploadArgs extends AxiosRequestConfig {
  body: FormData
}

export const createUploadMutation = async ({
  body,
  ...props
}: CreateUploadArgs) => {
  return api
    .post<CreateUploadResponse>('/uploads', body, props)
    .then((res) => res.data)
}
