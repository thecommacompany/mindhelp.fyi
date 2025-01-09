export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile']
  },
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture
      },
      loggedInAt: new Date()
    })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth-error')
  }
})