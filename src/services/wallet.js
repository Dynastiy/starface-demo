import $request from '@/axios/index'
import { catchAxiosError, catchAxiosSuccess } from './response'
// import { catchAxiosError } from './response'

export default {
  async earnWallet() {
    try {
      let res = await $request.get(`api/earn/wallet`)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async allWallets() {
    try {
      let res = await $request.get(`api/wallet/get-all-wallet`)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async deposit(formData){
    try {
        let res = await $request.post(`api/transaction/deposit`, formData)
        return res.data
      } catch (error) {
        catchAxiosError(error)
        throw error
      }
  },

  async convert(formData){
    try {
        let res = await $request.post(`api/transaction/convert`, formData)
        catchAxiosSuccess(res.data)
        return res.data
      } catch (error) {
        catchAxiosError(error)
        throw error
      }
  },

  async transfer(formData){
    try {
        let res = await $request.post(`api/transaction/transfer`, formData)
        catchAxiosSuccess(res.data)
        return res.data
      } catch (error) {
        catchAxiosError(error)
        throw error
      }
  },

  async withdraw(formData){
    try {
        let res = await $request.post(`api/transwithdraw`, formData)
        catchAxiosSuccess(res.data)
        return res.data
      } catch (error) {
        catchAxiosError(error)
        throw error
      }
  },

  async redeem(){
    try {
        let res = await $request.get(`api/transaction/redeem-stars`)
        catchAxiosSuccess(res.data)
        return res.data
      } catch (error) {
        catchAxiosError(error)
        throw error
      }
  },

  
  
}
