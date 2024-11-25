<template>
  <div class="reels-page h-[100dvh]">
    <el-skeleton style="width: 100%" :loading="loading" animated>
      <template #template>
        <div class="">
          <div class="flex flex-col w-full gap-4">
            <el-skeleton-item
              variant="image"
              style="height: 100vh; border-radius: 10px; width: 100%"
            />
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <wallet-data class="z-2" :starBalance="starBalance" />

          <!-- <wallet-data -->
          <div class="reel-container h-[100dvh]" v-for="(item, index) in reels" :key="index">
            <video
              class="reel-image"
              v-if="!item.hasError"
              @error="handleVideoError(index)"
              :src="item.videoUrl"
              loop
              playsInline
              :ref="`video-${index}`"
              preload="auto"
            ></video>
            <img
              v-else
              @error="$handleProfileError"
              :src="item.thumbnailUrl"
              alt="Placeholder"
              class="reel-video"
            />
            <div class="absolute text-white toggleMute">
              <button @click="toggleMute(index)">
                <i-icon
                  :icon="item.muted ? 'fluent:speaker-off-16-filled' : 'fluent:speaker-2-32-filled'"
                />
              </button>
              <!-- {{ item.muted ? 'Unmute' : 'Mute' }} -->
            </div>
            <!-- <img v-else src="@/assets/img/video.jpg" alt="Placeholder" class="reel-video" /> -->
            <div class="inner-content">
              <div class="reel-section">
                <div>
                  <div class="user-info flex gap-2 items-center">
                    <img
                      class="h-[35px] w-[35px] rounded-full object-cover object-top ring ring-[#fff]"
                      :src="item.avartar || $avatar"
                      @error="$handleProfileError"
                      alt=""
                    />
                    <!-- <img
                      class="h-[35px] w-[35px] rounded-full ring ring-[#fff]"
                      :src="item.thumbnailUrl"
                      @error="$handleProfileError"
                      alt=""
                    /> -->
                    <span class="text-sm">
                      <router-link :to="`/user/profile/${item.user}`">
                        {{ `@${item.userName}` }}
                      </router-link>
                    </span>
                    <button
                      class="brand-btn-md brand-outline text-white"
                      @click="followAction(item)"
                    >
                      {{ checkFollowing(item) ? 'Unfollow' : 'Follow' }}
                    </button>
                  </div>
                  <p class="mt-2 text-sm">{{ item.description }}</p>
                </div>
                <div class="reel-actions flex flex-col gap-4">
                  <span class="flex gap-1 items-center flex-col" @click="like(item)">
                    <i-icon
                      :class="[checkLiked(item) ? 'text-red-500' : '', 'text-[30px]']"
                      :icon="checkLiked(item) ? 'icon-park-solid:like' : 'icon-park-outline:like'"
                    />
                    <span class="text-xs">{{ item.likes }}</span>
                  </span>
                  <span class="flex gap-1 items-center flex-col" role="button">
                    <i-icon
                      class="text-[25px]"
                      icon="fontisto:comment"
                      @click="viewMore('comments', item)"
                    />
                    <span class="text-xs">{{ item?.comments?.length }}</span>
                  </span>
                  <span
                    class="flex gap-1 items-center flex-col"
                    role="button"
                    @click="triggerShare(item)"
                  >
                    <i-icon class="text-[25px]" icon="fa6-solid:share" />
                    <span class="text-xs">{{ item?.shares }}</span>
                  </span>
                  <span
                    class="flex gap-1 items-center flex-col"
                    role="button"
                    @click="viewMore('view')"
                  >
                    <i-icon class="text-[25px]" icon="uis:ellipsis-h" />
                  </span>
                  <span @click="gift(item)" class="flex gap-1 items-center flex-col" role="button">
                    <i-icon class="text-[35px] heartbeat" icon="noto-v1:sunflower" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <vDialog
      v-model:visible="showContainer"
      modal
      :style="{ width: '40%' }"
      @hide="closeContainer"
      @after-hide="closeContainer"
      :showHeader="false"
      unstyled
      :pt="{
        root: 'border-none',
        mask: {
          style: 'backdrop-filter: blur(4px)'
        }
      }"
    >
      <div class="">
        <span class="flex flex-col items-center justify-center w-full">
          <!-- <i-icon icon="fluent-emoji-flat:coin" class="text-[200px]" /> -->
          <img
            role="button"
            @click.once="redeem"
            src="@/assets/img/icons/claim.svg"
            alt=""
            :class="isLoading ? 'heartbeat' : 'fadeIn'"
          />
          <span class="text-white text-sm mt-12">Tap to claim</span>
        </span>
      </div>
    </vDialog>

    <Sidebar
      v-model:visible="visibleBottom"
      :show-close-icon="false"
      position="bottom"
      class="max-h-80 h-full"
    >
      <div class="">
        <comments
          v-if="actionable == 'comments'"
          @refresh="refresh"
          :items="comments"
          :reel="reel"
        />
      </div>
      <div class="">
        <ul v-if="actionable == 'view'">
          <li class="bg-gray-100 p-2 rounded-lg">Flag this post</li>
        </ul>
      </div>
    </Sidebar>
  </div>
</template>

<script>
import walletData from '@/components/utils/walletData.vue'
import Comments from '@/components/reels/Comments.vue'
/* eslint-disable no-prototype-builtins */
// import { useToast } from 'vue-toastification'
// const toast = useToast()
// import { useToast } from 'vue-toastification'
export default {
  components: { walletData, Comments },
  data() {
    return {
      filter: {
        per_page: 1,
        page_no: 1
      },
      reels: [],
      meta: {},
      loading: false,
      showContainer: false,
      timer: null,
      visibleBottom: false,
      actionable: null,
      comments: [],
      reel: {},
      starBalance: {},
      isLoading: false,
      userInfo: {},
      observer: null,
      videoElements: [],
      videoElement: null,
      isMuted: false
    }
  },

  methods: {
    getReels(e) {
      if (!e) {
        this.loading = true
      }
      this.$reels
        .list()
        .then((res) => {
          this.reels = res.reels.map((item) => ({
            ...item,
            muted: true // Default state: videos are muted
          }))
          // this.fetchUser()
        })
        .finally(() => {
          window.addEventListener('scroll', this.handlePlayback)
          document.addEventListener('visibilitychange', this.handleVisibilityChange)
          this.$nextTick(() => {
            this.handlePlayback() // Initial playback check
          })
          this.loading = false
        })
    },

    toggleMute(index) {
      const video = this.$refs[`video-${index}`][0] // Access video element
      if (video) {
        this.reels[index].muted = !this.reels[index].muted
        video.muted = this.reels[index].muted
      } else {
        console.error(`Video element for index ${index} not found`)
      }
    },

    getUser() {
      this.$auth.getUser(this.user._id).then((res) => {
        console.log(res)
        this.$store.commit('auth/setUser', res.user)
        return res
      })
    },

    likeAction(e) {
      if (!this.checkFollowing(e)) this.follow(e)
      return
    },

    checkFollowing(e) {
      if (!this.isLoggedIn) {
        return
      }
      let following = this.user.following
      let isFollowing = following.find((item) => item == e.user)
      return isFollowing
    },

    followAction(e) {
      let payload = {
        targetUserId: e.user, //like, unlike, favorite, unfavorite, follow, unfollow
        action: this.checkFollowing(e) ? 'unfollow' : 'follow'
      }
      this.$userActivity.toggleUserActions(payload).then(() => {
        this.getUser()
      })
    },

    handleVideoError(index) {
      this.reels[index].hasError = true
    },

    redeem() {
      if (!this.isLoggedIn) {
        this.$toastify({
          text: 'Login to be able claim bonus.',
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
      this.isLoading = true
      this.$wallet
        .redeem()
        .then((res) => {
          this.getEarnWallet()
          this.showContainer = false
          return res
        })
        .finally(() => {
          this.isLoading = false
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
      this.$wallet.gift().then((res) => {
        this.getEarnWallet()
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

    getEarnWallet() {
      if (!this.isLoggedIn) {
        return
      }
      this.$wallet.earnWallet().then((res) => {
        console.log(res)
        this.starBalance = res.star
      })
    },

    refresh() {
      this.getReel(this.reel._id)
      this.getReels('refresh')
    },

    getReel(id) {
      this.$reels.get(id).then((res) => {
        console.log(res)
        this.comments = res.reel.comments
        this.reel = res.reel
      })
    },

    viewMore(e, value) {
      this.visibleBottom = true
      this.actionable = e
      this.getReel(value._id)
      // this.comments = value
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
        this.getReels('refresh')
      })
      // .finally(() => {
      //   this.loading = false
      // })
    },

    checkLiked(e) {
      if (!this.isLoggedIn) {
        return
      }
      let isUser = e.likedBy.find((item) => item == this.user._id)
      return isUser
    },

    async fetchUser() {
      // this.loading = true;
      // this.error = null;

      // Create an array of Axios requests
      const requests = this.reels
        .filter((item) => item.user)
        .map((item) => {
          return this.$auth
            .getUser(`${item.user}`)
            .then((response) => {
              this.userInfo[item.user] = response.user
            })
            .catch((err) => {
              // this.error = 'An error occurred while fetching reviewer data.';
              console.log(err)
            })
        })

      // Wait for all requests to complete
      try {
        await Promise.all(requests)
      } catch (err) {
        this.error = 'An error occurred while fetching reviewer data.'
      } finally {
        // Add event listeners for scroll and visibility
        window.addEventListener('scroll', this.handlePlayback)
        document.addEventListener('visibilitychange', this.handleVisibilityChange)
        this.$nextTick(() => {
          this.handlePlayback() // Initial playback check
        })
        this.loading = false
      }
    },

    handlePlayback() {
      this.reels.forEach((item, index) => {
        const video = this.$refs[`video-${index}`]
        console.log(video)
        if (video) {
          const rect = video[0].getBoundingClientRect()
          const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
          if (isVisible) {
            video[0]
              .play()
              .catch((error) => console.warn(`Playback failed for video-${index}:`, error))
          } else {
            video[0].pause()
            video[0].muted = true
          }
        }
      })
    },

    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        this.handlePlayback() // Play videos if the page is visible
      } else {
        this.reels.forEach((item, index) => {
          let video = this.$refs[`video-${index}`] && this.$refs[`video-${index}`][0]
          if (video) {
            video.pause() // Pause the video when the page is not visible
            video.muted = true // Optionally mute the video
          }
        })
      }
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
        this.getReels('refresh')
      })
      console.log(e)
    },

    // Method to display the container at a random time
    showContainerAtRandomTime() {
      // Clear any existing timer
      clearTimeout(this.timer)

      // Set a new random time between 1 and 60 seconds
      const randomTime = Math.floor(Math.random() * 60000)

      // Set a timeout to show the container
      this.timer = setTimeout(() => {
        console.log('alert')
      }, randomTime)
    },

    openContainer() {
      this.showContainer = true
    },

    showContainerModified() {
      setTimeout(() => {
        this.openContainer() // Run the operation immediately
        // Then, schedule the repeated execution every 30 minutes (1,800,000 milliseconds)
        setInterval(this.openContainer, 600000)
      }, 60000) // 10 mi
    },
    // Method to close the container and restart the process
    closeContainer() {
      this.showContainer = false
      this.showContainerAtRandomTime()
    }
  },

  beforeMount() {
    this.getReels()
    this.getEarnWallet()
  },

  mounted() {
    // Start the process when the component is mounted
    this.showContainerModified()

    this.$nextTick(() => {
      this.handlePlayback()
      window.addEventListener('scroll', this.handlePlayback)
      document.addEventListener('visibilitychange', this.handleVisibilityChange)
    })
  },

  beforeUnmount() {
    // Clear the timer when the component is destroyed
    clearTimeout(this.timer)

    window.removeEventListener('scroll', this.handlePlayback)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },

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

<style scoped>
.toggleMute {
  z-index: 99999999999;
  top: 20px;
  right: 20px;
}

.reels-page {
  background-color: #000;
  /* height: 100; */
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  width: 100%;
}

.reel-container {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  scroll-snap-align: start;
  width: 100%;
}

.reel-video {
  height: 100%;
  right: 50%;
  transform: translate(50%, 0%);
  object-fit: cover;
  object-position: bottom;
  position: absolute;
  top: 0;
  width: auto;
  z-index: 0;
}

.reel-image {
  height: 100%;
  right: 50%;
  transform: translate(50%, 0%);
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  width: auto;
  z-index: 0;
}

.inner-content {
  color: #fff;
  flex-direction: column;
  height: 100%;
  padding: 0 15px;
  position: absolute;
  z-index: 1;
}

.inner-content,
.reel-section {
  display: flex;
  display: inline-flex;
  display: -webkit-flex;
  justify-content: space-between;
  width: 100%;
}

.reel-section {
  align-items: flex-end;
  margin-top: auto;
  padding: 15px 0 80px;
}

.reel-section .user-item {
  align-items: center;
  display: flex;
  flex: 1 1;
  margin-bottom: 1rem;
}
</style>
