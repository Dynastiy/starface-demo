import $request from '@/axios/index'
import { catchAxiosError, catchAxiosSuccess } from './response'

export default {
  
  async login(formData) {
    try {
      let res = await $request.post(`api/auths/signin`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      // return error
      throw error
    }
  },

  async requestCode(formData) {
    try {
      let res = await $request.post(`api/auths/request-otp`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async resendCode(formData) {
    try {
      let res = await $request.post(`api/auths/resendotp`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async verifyOTP(formData) {
    try {
      let res = await $request.post(`api/auths/verify-otp`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },
  async setPassword(formData) {
    try {
      let res = await $request.post(`api/auths/set-password`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },
}
