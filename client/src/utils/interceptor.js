const jwtAuthToken = localStorage.getItem('jwtToken')

window.axios.interceptors.request.use(function(config) {
  if (jwtAuthToken) {
    config.headers.Authorization = jwtAuthToken
  }
  return config
})
