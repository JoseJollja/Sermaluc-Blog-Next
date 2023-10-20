import { IUser } from '@/interface/user'
import { create } from 'zustand'

interface AuthStore {
  isAuth: boolean
  isLoading: boolean
  user: IUser | null
  logoutAction: () => void
  loginAction: (user: IUser) => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuth: false,
  isLoading: true,
  logoutAction: () => set({ isAuth: false, user: null }),
  loginAction: (user) => set({ isAuth: true, user }),
  setLoading: (isLoading) => set({ isLoading })
}))
