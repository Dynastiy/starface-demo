import Login from '@/modules/Auth/Login.vue'
import Register from '@/modules/Auth/register/RequestCode.vue'
import AuthPage from '@/modules/Auth/AuthPage.vue'
import VerifyCode from '@/modules/Auth/register/VerifyCode.vue'
import SetPassword from '@/modules/Auth/register/SetPassword.vue'

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
    path: '/signup',
    name: 'register',
    component: Register,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },

  {
    path: '/signup/verify-code',
    name: 'verify-code',
    component: VerifyCode,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },

  {
    path: '/signup/set-password',
    name: 'set-password',
    component: SetPassword,
    meta: {
      layout: 'Auth',
      requiresAuth: false
    }
  },
]

export default routes
