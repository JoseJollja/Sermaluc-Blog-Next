import { useQuery } from '@tanstack/react-query'

import {
  getAllCommentsQuery,
  type GetAllCommentsQueryProps
} from '@/api/comment/get-all-comments.query'

export const useGetAllCommentsQuery = (props: GetAllCommentsQueryProps) => {
  return useQuery({
    queryKey: ['comments', props.params],
    queryFn: () => {
      return getAllCommentsQuery(props)
    }
  })
}
