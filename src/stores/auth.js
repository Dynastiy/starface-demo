// import router from "@/router"

export default {
  namespaced: true,
  state: {
    user: null,
    starface_token: null,
  },

  mutations: {
    setUser(state, data) {
      state.user = data
    },

    login(state, { token, user }) {
      state.starface_token = token;
      state.user = user;
    },

    async LOGOUT(state) {
      state.user = null
      state.starface_token = null
      localStorage.clear()
    },

    RESET(state) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key], null)
      })
    }
  },

  actions: {
    logout({ commit }) {
      commit('LOGOUT')
    }
  },
  
  getters: {
    auth: (state) => state.auth,
    isLoading: (state) => state.loading,
    getUser: (state) => state.user,
    getAddress: (state) => state.address,
    getUserMeta: (state) => state.userMeta,
    getToken: (state) => state.starface_token,
    getWalletAddress: (state) => state.address,
    getSubCategories: (state) => state.sub_categories,
    getTags: (state) => state.tags,
    getOrder: (state) => state.order,
    getAuthenticated: (state) => !!state.starface_token,
    getUserID:(state) => state.user.existingUser._id
  }
}
