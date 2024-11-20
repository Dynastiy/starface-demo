import { createStore } from "vuex";

import createPersistedState from "vuex-persistedstate";

import auth from "./modules/auth";
import drawer from "./drawer";

// initial state
let initialState = {
  auth: auth.state,
  drawer: drawer.state
};
// const debug = process.env.NODE_ENV !== "production";
let plugins = [createPersistedState({})];
// if (debug) plugins.push(createLogger());
export default createStore({
  modules: {
    auth,
    drawer
  },
  plugins,
  state: {
  },
  mutations: {
    RESET(state) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key], initialState[key]);
      });
    },

  },
  actions: {},
  getters: {
    getToken: (state) => state.auth.token,
  },
});