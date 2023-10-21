import { api } from '../client'

export const deleteArticleMutation = async (id: string) => {
  return api.delete<{ ok: boolean }>(`/articles/${id}`).then((res) => res.data)
}
