import { useMutation } from '@tanstack/react-query'

import { updateArticleMutation } from '@/api/article/update-article.mutation'

export const useUpdateArticleMutation = () => {
  return useMutation({
    mutationKey: ['update:article'],
    mutationFn: updateArticleMutation
  })
}
