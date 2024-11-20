import Login from '@/modules/Auth/Login.vue'
import Register from '@/modules/Auth/Register.vue'
import AuthPage from '@/modules/Auth/AuthPage.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage,
    meta: {
      layout: '',
      requiresAuth: false
    }
  },

  {
    path: '/auth/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },

  {
    path: '/auth/register',
    name: 'register',
    component: Register,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },
]

export default routes
