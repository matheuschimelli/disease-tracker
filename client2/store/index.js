export const state = () => ({
  user: null,
  token: null
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}
export const actions = {
  nuxtServerInit({ commit }) {
    let user = null

    if (localStorage.getItem('user')) {
      user = localStorage.getItem('user')
      commit('SET_USER', user)
    }
  },

  settoken({ commit }, { token }) {
    commit('SET_TOKEN', token)
  }
}
