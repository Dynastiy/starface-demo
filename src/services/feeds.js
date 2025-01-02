/* eslint-disable no-undef */
import $request from '@/axios/index'
import { catchAxiosError, catchAxiosSuccess } from './response'
// import { catchAxiosError } from './response'
// import { useToast } from "vue-toastification";
// const toast = useToast();

// const uploadProgress = 0

export default {
  async list(params) {
    try {
      let res = await $request.get(`api/post/get-posts`, { params })
      return res.data
    } catch (error) {
      //   catchAxiosError(error)
      //   throw error
      return error
    }
  },

  async get(id) {
    try {
      let res = await $request.get(`api/post/get-posts/${id}`)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async comment(formData, id) {
    try {
      let res = await $request.post(`api/post-action/comment/${id}`, formData)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async create(formData) {
    // eslint-disable-next-line no-undef
    NProgress.start()
    try {
      let res = await $request.post(`api/post/upload`, formData)
      catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    } finally {
      NProgress.done()
    }
  },

  async uploadImage(formData) {
    NProgress.start()
    try {
      let res = await $request.post(`api/images/upload?timestamp=${Date.now()}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            onUploadProgress(progressEvent)
          }
        }
      })
      catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    } finally {
      NProgress.done()
    }
  },

  async like(formData, id) {
    try {
      let res = await $request.post(`api/post-action/like/${id}`, formData)
      // catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async react(formData, id) {
    try {
      let res = await $request.post(`api/post-action/react/${id}`, formData)
      // catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  

  async share(id) {
    try {
      let res = await $request.post(`api/post-action/share/${id}`)
      // catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async delete(id) {
    try {
      let res = await $request.delete(`api/reel/reels/${id}`)
      catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },
  

  async promote(id, formData) {
    try {
      let res = await $request.post(`api/promotion/post/${id}`, formData)
      catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },

  async analytics(id, formData) {
    try {
      let res = await $request.post(`api/promotion/post/${id}`, formData)
      catchAxiosSuccess(res.data)
      return res.data
    } catch (error) {
      catchAxiosError(error)
      throw error
    }
  },
}
