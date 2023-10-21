import { useQuery } from '@tanstack/react-query'

import {
  getArticleByIDQuery,
  type GetArticleByIDQueryProps
} from '@/api/article/get-article-by-id.query'

export const useGetArticleByIDQuery = (props: GetArticleByIDQueryProps) => {
  return useQuery({
    queryKey: ['article', props.id],
    queryFn: () => {
      return getArticleByIDQuery(props)
    }
  })
}
