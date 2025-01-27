export default defineNuxtRouteMiddleware(( to) => {
  const { loggedIn } = useUserSession()
  
  if (!loggedIn.value) {
    if(to.path === '/login' || to.path === '/signup') {
      return
    }
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
