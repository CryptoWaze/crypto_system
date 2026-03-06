import type { UserResponse } from "@/lib/types/auth"

const STORAGE_KEY = "crypto_forense_user"

export function setUser(user: UserResponse): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getUser(): UserResponse | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserResponse
  } catch {
    return null
  }
}

export function clearUser(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(STORAGE_KEY)
}
