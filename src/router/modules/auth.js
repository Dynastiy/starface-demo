import Login from '@/modules/App/Auth/Login.vue'
import Register from '@/modules/App/Auth/Register.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },

  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },
]

export default routes
