import $request from '@/axios/index'
import { catchAxiosError, catchAxiosSuccess } from './response'

export default {
  async createAccount(formData) {
    try {
      let res = await $request.post(`/auth/signup`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      // return error
      throw error
    }
  },

  async forgotPasswordRequestLink(formData) {
    try {
      let res = await $request.post(`/auth/forgot-password`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      // return error
      throw error
    }
  },


  async resetPassword(formData, {token, email}) {
    try {
      let res = await $request.post(`/auth/reset-password?token=${token}&email=${email}`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      // return error
      throw error
    }
  },

  async getProfile() {
    try {
      let res = await $request.get(`/auth/user-profile`)
      // catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      // catchAxiosError(error)
      return error
      // throw error
    }
  },

  async changePassword(formData) {
    try {
      let res = await $request.post(`/auth/change-password`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      //   return error
      throw error
    }
  },

  async updateProfile(formData) {
    try {
      let res = await $request.post(`/auth/update-profile-details`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      //   return error
      throw error
    }
  },

  async updateCoverPhoto(formData) {
    try {
      let res = await $request.post(`/auth/update-cover-photo`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      //   return error
      throw error
    }
  },

  async updateProfilePhoto(formData) {
    try {
      let res = await $request.post(`/auth/update-profile-photo`, formData)
      catchAxiosSuccess(res)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      //   return error
      throw error
    }
  }
}
