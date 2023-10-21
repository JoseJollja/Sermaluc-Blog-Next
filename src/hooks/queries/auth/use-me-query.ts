import { useQuery } from '@tanstack/react-query'

import { meQuery } from '@/api/auth/me.query'

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: meQuery
  })
}
