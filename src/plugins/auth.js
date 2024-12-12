import { jwtDecode } from 'jwt-decode'
import $toastify from 'toastify-js'
// import Vue from "vue";
import store from '@/store'
import router from '@/router'

export function checkTokenExpiration() {
  const token = localStorage.getItem('_starface_token')
  if (token) {
    // Decode the token to get the expiration time
    const tokenData = jwtDecode(token)
    console.log(tokenData, 'ommmmmo')

    // Check if the token has expired
    if (tokenData.exp * 1000 < Date.now()) {
      // if (tokenData.exp * 1000 > 10) {
      //   Vue.$toast.open({
      //     message: `JWT Token Expired, please, login`,
      //     type: "error",
      //     position: "top",
      //   });
      // loginUser()
      $toastify({
        text: 'Session Expired, login',
        gravity: 'top', // `top` or `bottom`
        position: 'center', // `left`, `center` or `right`
        style: {
          fontSize: '13px',
          borderRadius: '4px',
          background: '#ff0000'
        }
      }).showToast()
      store.dispatch('auth/logout')
      router.push('/auth/login')
      console.log('expired')
    }
  }
}
