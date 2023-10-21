import { useMutation } from '@tanstack/react-query'

import { createArticleMutation } from '@/api/article/create-article.mutation'

export const useCreateArticleMutation = () => {
  return useMutation({
    mutationKey: ['create:article'],
    mutationFn: createArticleMutation
  })
}
