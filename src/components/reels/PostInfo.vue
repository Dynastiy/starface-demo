<template>
  <div>
    <div class="px-2 pb-3" v-if="item.title || item.description">
      <h6 class="font-xs font-semibold dark:text-gray-100 text-black2">{{ item.title }}</h6>
      <p class="text-xs font-regular dark:text-gray-100 text-black2">{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reelData: {}
  },
  data() {
    return {
      item: {}
    }
  },

  methods: {
    getUser() {
      this.$auth.getUser(this.user._id).then((res) => {
        console.log(res)
        this.$store.commit('auth/setUser', res.user)
        return res
      })
    },

    gift(e) {
      console.log(this.isLoggedIn)
      if (!this.isLoggedIn) {
        this.$toastify({
          text: 'Login to be able gift user.',
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          style: {
            fontSize: '13px',
            borderRadius: '4px',
            background: '#ff0000'
          }
        }).showToast()
        // toast.error('Login to be able gift user.', {
        //   timeout: 4000
        // })

        this.$router.push('/auth/login')
        return
      }
      let payload = {
        amountToGift: 5,
        reelsOwnerId: e.user
      }
      // this.isLoading = true
      this.$wallet.gift(payload).then((res) => {
        // this.()
        return res
      })
      console.log(payload)
    },

    async onShare(callback) {
      try {
        await navigator.share({
          title: `
            Refer your friends and earn upto <b>25 SFC</b> per referral & your friends will get
          <b>20 SFC</b>`,
          text: 'Share referral code',
          url: this.locat
        })
        // Run the callback on success
        if (callback) callback()
      } catch (err) {
        alert(err)
      }
    },

    onShareSuccess(e) {
      // console.log('Share was successful!')
      this.completeShare(e)
      // Perform additional actions like showing a success message or tracking an event
    },

    triggerShare(e) {
      this.onShare(this.onShareSuccess(e))
    },

    refresh() {
      //   this.getReel(this.reel._id)
      this.$emit('refresh')
    },

    getReel(id) {
      this.$reels.get(id).then((res) => {
        console.log(res)
        this.comments = res.reel.comments
        this.reel = res.reel
      })
    },

    viewMore(e, value) {
      let dataToPass = { e, value }
      this.$emit('getActionable', JSON.stringify(dataToPass))
    },

    like(e) {
      if (!this.isLoggedIn) {
        this.$toastify({
          text: 'Login to like reel.',
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          style: {
            fontSize: '13px',
            borderRadius: '4px',
            background: '#ff0000'
          }
        }).showToast()
        this.$router.push('/auth/login')
        return
      }
      let payload = {
        action: this.checkLiked(e) ? 'unlike' : 'like'
      }
      this.$reels.like(payload, e._id).then((res) => {
        console.log(res)
        this.$emit('refresh')
      })
    },

    checkLiked(e) {
      if (!this.isLoggedIn) {
        return
      }
      let isUser = e.likedBy.find((item) => item == this.user._id)
      return isUser
    },

    completeShare(e) {
      if (!this.isLoggedIn) {
        this.$toastify({
          text: 'Login to be able gift user.',
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          style: {
            fontSize: '13px',
            borderRadius: '4px',
            background: '#ff0000'
          }
        }).showToast()
        this.$router.push('/auth/login')
        return
      }
      this.$reels.share(e._id).then((res) => {
        console.log(res)
        this.$emit('refresh')
      })
      console.log(e)
    }
  },

  watch: {
    reelData: {
      handler(val) {
        this.item = val
      },
      immediate: true
    }
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },
    isLoggedIn() {
      return this.$store.getters['auth/getAuthenticated']
    }
  }
}
</script>

<style></style>
