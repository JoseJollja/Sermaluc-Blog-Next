import { useMutation } from '@tanstack/react-query'

import { deleteArticleMutation } from '@/api/article/delete-article.mutation'

export const useDeleteArticleMutation = () => {
  return useMutation({
    mutationKey: ['delete:article'],
    mutationFn: deleteArticleMutation
  })
}
