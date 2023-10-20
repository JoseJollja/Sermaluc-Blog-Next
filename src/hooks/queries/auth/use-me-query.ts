import { useQuery } from '@tanstack/react-query'

import { AxiosError } from 'axios'
import { ApiResponseError } from '@/interface'
import { meQuery, MeQueryResponse } from '@/api/auth/me.query'

export const useMeQuery = () => {
  return useQuery<MeQueryResponse, AxiosError<ApiResponseError>>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await meQuery()
      return res.data
    }
  })
}
