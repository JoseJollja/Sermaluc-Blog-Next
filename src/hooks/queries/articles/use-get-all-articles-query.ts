import { useQuery } from '@tanstack/react-query'

import {
  getAllArticlesQuery,
  type GetAllArticlesQueryProps
} from '@/api/article/get-all-articles.query'

export const useGetAllArticlesQuery = (
  props: GetAllArticlesQueryProps = {}
) => {
  return useQuery({
    queryKey: ['articles', props.params],
    queryFn: () => {
      return getAllArticlesQuery(props)
    }
  })
}
