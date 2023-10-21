import { useMutation } from '@tanstack/react-query'

import { AxiosError } from 'axios'
import { ApiResponseError } from '@/interface'
import {
  registerMutation,
  RegisterMutationResponse,
  RegisterMutationVariables
} from '@/api/auth/register.mutation'

export const useRegisterMutation = () => {
  return useMutation<
    RegisterMutationResponse,
    AxiosError<ApiResponseError>,
    RegisterMutationVariables
  >({
    mutationFn: async (args) => {
      const res = await registerMutation({ body: args })
      return res.data
    }
  })
}
