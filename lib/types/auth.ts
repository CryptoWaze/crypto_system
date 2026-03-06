export interface LoginCredentials {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export type LoginSuccess = {
  success: true
  user: UserResponse
}

export type LoginFailure = {
  success: false
  message: string
}

export type LoginResult = LoginSuccess | LoginFailure

export type AuthFeedback = {
  type: "success" | "error"
  message: string
}
