declare module '#auth-utils' {
  interface User {
    name: string
    email: string
    picture?: string
  }

  interface UserSession {
    user: User
    loggedInAt: Date
  }

  interface SecureSessionData {
    role?: 'user' | 'professional' | 'hospital' | 'organization' | 'admin'
    profileId?: string
  }
}
