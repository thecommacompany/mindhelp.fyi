export default defineEventHandler(async (event) => {
  const { pathname } = getRouterParams(event)

  // Set security headers
  setHeader(event, 'Content-Security-Policy', "img-src 'self'; default-src 'none'")
  
  return hubBlob().serve(event, pathname)
})
