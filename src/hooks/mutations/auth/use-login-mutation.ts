import { useMutation } from '@tanstack/react-query'

import {
  loginMutation,
  type LoginMutationResponse,
  type LoginMutationVariables
} from '@/api/auth/login.mutation'

import { AxiosError } from 'axios'
import { ApiResponseError } from '@/interface'

export const useLoginMutation = () => {
  return useMutation<
    LoginMutationResponse,
    AxiosError<ApiResponseError>,
    LoginMutationVariables
  >({
    mutationFn: async (args) => {
      const res = await loginMutation({ body: args })
      return res.data
    }
  })
}
