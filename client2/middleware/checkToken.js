export default function({ store, redirect, query, $axios }) {
  // If the user is not authenticated
  if (!query.token) {
    return redirect('/')
  }
  if (store.state.token) {
    return redirect('/')
  } else {
    $axios
      .get('/api/auth/user', {
        headers: { Authorization: 'Bearer ' + query.token }
      })
      .then((response) => {
        store.commit('SET_TOKEN', { token: query.token })
        store.commit('SET_USER', { user: response.data })
      })

    return redirect('/')
  }
}
