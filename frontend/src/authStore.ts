import { create } from 'zustand'
import type { Role, User } from './types'

type AuthState = {
  user: User | null
  login: (params: { email: string; role: Role }) => void
  logout: () => void
  updatePhoto: (photoUrl: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: ({ email, role }) => {
    const name = email.split('@')[0] || 'Utilisateur'
    const user: User = {
      id: email,
      email,
      name,
      role,
    }
    set({ user })
  },
  logout: () => set({ user: null }),
  updatePhoto: (photoUrl) =>
    set((state) => (state.user ? { user: { ...state.user, photoUrl } } : state)),
}))


