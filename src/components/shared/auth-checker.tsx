import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/stores/auth.store'
import type { MeQueryResponse } from '@/api/auth/me.query'

const AuthChecker = () => {
  const client = useQueryClient()

  useEffect(() => {
    const { setLoading, loginAction } = useAuthStore.getState()

    const me = client
      .getQueryCache()
      .find<MeQueryResponse>({ queryKey: ['me'] })

    if (me?.state.data?.ok) loginAction(me.state.data.data)

    setLoading(false)
  }, [client])

  return null
}

export default AuthChecker
