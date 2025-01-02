<template>
  <div>
    <div class="flex px-2 py-2 justify-between items-center" v-if="user && user._id == item.user">
      <button class="text-primary whitespace-nowrap text-[12px] font-medium" v-if="item.promoted">
        View Analytics
      </button>
      <div class="w-full text-right">
        <button
          @click.stop="$router.push(`/feed/${item._id}/promote`)"
          v-if="!item.promoted"
          class="brand-btn brand-primary-clear text-[12px] py-[5px] px-2 rounded-[4px]"
        >
          Promote Post
        </button>
      </div>
    </div>
    <hr
      class="dark:border-gray-600 border-gray-300"
      v-if="(item.title || item.description) && user && user._id == item.user"
    />
    <div class="flex justify-between relative w-full p-2">
      <div class="reel-actions flex gap-6">
        <!-- <button
          @mousedown="startPress"
          @mouseup="cancelPress"
          @touchstart="startPress"
          @touchend="cancelPress"
          @mouseenter="startHover"
          @mouseleave="cancelHover"
          class="flex gap-2 items-center dark:text-gray-50 text-black3"
          @click="like(item)"
        > -->
        <button
          class="flex gap-2 items-center dark:text-gray-50 text-black3"
          @click.stop="like(item)"
        >
          <i-icon
            :class="[checkLiked(item) ? 'text-red-500' : '', 'text-[20px]']"
            :icon="checkLiked(item) ? 'icon-park-solid:like' : 'icon-park-outline:like'"
          />
          <!-- <span>{{showReaction()}}</span> -->
          <span class="text-sm font-semibold no-select">{{ item.likes }}</span>
        </button>
        <button class="flex gap-2 items-center dark:text-gray-50 text-black3" role="button">
          <i-icon class="text-[15px]" icon="fontisto:comment" @click.stop="viewMore" />
          <span class="text-sm font-semibold no-select">{{ item?.comments?.length }}</span>
        </button>
        <button
          class="flex gap-2 items-center dark:text-gray-50 text-black3"
          role="button"
          @click.stop="triggerShare(item)"
        >
          <i-icon class="text-[15px]" icon="tabler:share-3" />
          <span class="text-sm font-semibold no-select">{{ item?.shares }}</span>
        </button>
      </div>
      <button
        v-if="user && user._id !== item.user"
        @click.stop="gift(item)"
        class="flex gap-1 items-center flex-col"
        role="button"
      >
        <i-icon class="text-[25px] heartbeat" icon="noto-v1:sunflower" />
      </button>

      <!-- Popup -->
      <!-- <div
        v-if="showPopup"
        class="absolute bottom-12 z-10 overlay bg-black bg-opacity-50 rounded rounded-md p-2 border-gray-400"
      >
        <div class="popup" @click.stop @touchend.stop>
          <p>Popup triggered by long press or long hover!</p>
          <button @click="closePopup">Close</button>
        </div>
      </div> -->

      <div
        v-if="showReactionBox"
        class="reaction-box-overlay absolute bottom-12 z-10 overlay bg-black bg-opacity-50 rounded rounded-md p-2 border-gray-400"
        @click="closeReactionBox"
        @touchend="closeReactionBox"
      >
        <div class="reaction-box flex gap-6" @click.stop @touchend.stop>
          <!-- <button class="reaction text-white text-xs flex flex-col items-center" @click="setReaction('Like')"><span>👍</span> Like</button> -->
          <button
            class="reaction text-white text-xs flex flex-col items-center"
            @click="setReaction('love')"
          >
            <span class="text-2xl">❤️</span> Love
          </button>
          <button
            class="reaction text-white text-xs flex flex-col items-center"
            @click="setReaction('wow')"
          >
            <span class="text-2xl">😮</span> Wow
          </button>
          <button
            class="reaction text-white text-xs flex flex-col items-center"
            @click="setReaction('sad')"
          >
            <span class="text-2xl">😢</span> Sad
          </button>
          <button
            class="reaction text-white text-xs flex flex-col items-center"
            @click="setReaction('angry')"
          >
            <span class="text-2xl">😡</span> Angry
          </button>
        </div>
      </div>
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
      item: {},
      pressTimer: null,
      hoverTimer: null,
      showReactionBox: false,
      selectedReaction: null,
      isTouchDevice: false,
      reactionExists: true
    }
  },

  methods: {
    // Handle press start (touch or mouse)
    startPress() {
      if (this.isTouchDevice) {
        this.startPressForTouch()
      } else {
        this.startHover()
      }
    },

    // Cancel press timer
    cancelPress() {
      clearTimeout(this.pressTimer)
      clearTimeout(this.hoverTimer)
    },

    // For touch devices (long press)
    startPressForTouch() {
      this.pressTimer = setTimeout(() => {
        this.showReactionBox = true
      }, 1000) // 1-second long press to show the reaction box
    },

    // For mouse devices (hovering)
    startHover() {
      if (!this.isTouchDevice) {
        this.hoverTimer = setTimeout(() => {
          this.showReactionBox = true
        }, 1000) // 1-second hover to show the reaction box
      }
    },

    // Cancel hover timer
    cancelHover() {
      clearTimeout(this.hoverTimer)
    },

    // Set the selected reaction
    setReaction(reaction) {
      // this.selectedReaction = reaction
      if (!this.isLoggedIn) {
        this.$toastify({
          text: 'Login to react to post.',
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
      if (this.checkLiked(this.item)) {
        this.like()
        return
      }

      let payload = {
        reactionType: reaction
      }
      this.$feeds.react(payload, this.item._id).then((res) => {
        console.log(res)
        // this.$emit('refresh')
      })
      this.closeReactionBox()
    },

    // Close the reaction box
    closeReactionBox() {
      this.showReactionBox = false
    },

    handleOutsideClick(event) {
      const overlay = this.$el.querySelector('.reaction-box-overlay')
      // console.log(overlay.contains(event.target))
      if (this.showReactionBox && overlay && !overlay.contains(event.target)) {
        this.closeReactionBox()
      }
    },

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

    async triggerShare(e) {
      // this.onShare(this.onShareSuccess(e))

      try {
        await navigator.share({
          title: `
          I have just saw this post on Starface.chat.`,
          text: 'Share Post Link',
          url: `${this.locat}/feeds/${e._id}/view`
        })
        // Run the callback on success
        // if (callback) callback()
        this.completeShare(e)
      } catch (err) {
        alert(err)
      }
    },

    getReaction() {
      //  <button class="reaction text-white text-xs flex flex-col items-center" @click="setReaction('Like')"><span>👍</span> Like</button> -->
      // <button class="reaction text-white text-xs flex flex-col items-center" @click="setReaction('love')"><span class="text-2xl">❤️</span> Love</button>
      // <button class="reaction text-white text-xs flex flex-col items-center" @click="setReaction('wow')"><span class="text-2xl">😮</span> Wow</button>
      // <button class="reaction text-white text-xs flex flex-col items-center" @click="setReaction('sad')"><span class="text-2xl">😢</span> Sad</button>
      // <button class="reaction text-white text-xs flex flex-col items-center" @click="setReaction('angry')"><span class="text-2xl">😡</span> Angry</button>
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

    viewMore() {
      let dataToPass = this.item
      this.$emit('getActionable', JSON.stringify(dataToPass))
    },

    like(e) {
      if (!this.isLoggedIn) {
        this.$toastify({
          text: 'Login to like post.',
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
      this.$feeds.like(payload, e._id).then((res) => {
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
          text: 'Login to be share post.',
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
      this.$feeds.share(e._id).then((res) => {
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

  mounted() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Add event listener to detect clicks outside the overlay
    document.addEventListener('click', this.handleOutsideClick)
    // document.addEventListener('touchend', this.handleOutsideClick)
  },

  beforeUnmount() {
    // Clean up event listeners when component is destroyed
    document.removeEventListener('click', this.handleOutsideClick)
    // document.removeEventListener('touchend', this.handleOutsideClick)
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },
    isLoggedIn() {
      return this.$store.getters['auth/getAuthenticated']
    },
    locat() {
      // let window;
      console.log(window.location)
      return `${window.location.origin}`
    },
  }
}
</script>

<style></style>
