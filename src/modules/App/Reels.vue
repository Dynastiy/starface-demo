<template>
  <div class="h-screen overflow-y-auto snap-y snap-mandatory">
    <div
      v-for="(video, index) in videos"
      :key="video._id"
      class="h-[100dvh] flex justify-center items-center snap-start relative"
      ref="videoContainer"
      :data-index="index"
    >
      <!-- Video Container -->
      <div class="relative">
        <template v-if="!videoError[index]">
          <!-- Video Element -->
          <video
            :src="video.videoUrl"
            class="h-[100dvh] w-[100vw] object-cover"
            @loadeddata="handleLoaded(index)"
            @error="handleVideoError(index)"
            playsinline
            loop
            :muted="muteAll"
            ref="videoPlayers"
          ></video>
        </template>
        <template v-else>
          <!-- Fallback Image -->
          <img
            :src="
              video.fallbackImage || 'https://via.placeholder.com/640x360?text=Video+Unavailable'
            "
            @error="handleFallbackError(index)"
            alt="Fallback"
            class="h-[100dvh] w-[100vw] object-cover"
          />
        </template>

        <!-- Loader for video loading -->
        <div
          v-if="!videoLoaded[index] && !videoError[index]"
          class="!bg-[#fff] bg-opacity-50 h-[100dvh] absolute inset-0 flex items-center justify-center"
        >
          <!-- <img src="@/assets/animati+on/load.gif" alt="" /> -->
          <!-- <span>Loading</span> -->
          <i-icon icon="eos-icons:loading" />
        </div>
      </div>

      <!-- Title Overlay -->
      <div
        class="absolute bottom-0 px-4 pb-20 w-full text-white bg-gradient-to-t from-black to-transparent"
      >
        <div class="flex justify-between items-end">
          <user-data :reelData="video" />
          <actions @getActionable="getActionable" :reelData="video" />
        </div>
      </div>
    </div>

    <div class="absolute top-5 px-4 flex justify-between items-center w-full">
      <!-- Wallet Data  -->
      <div class="bg-black text-white px-3 py-1 bg-opacity-50 rounded-md">
        <wallet-data :starBalance="starBalance" />
      </div>

      <!-- Global Mute Toggle Button -->
      <button class="bg-black text-white p-2 bg-opacity-50 rounded-full" @click="toggleMuteAll">
        <!-- {{ muteAll ? 'Unmute All' : 'Mute All' }} -->
        <i-icon
          :icon="muteAll ? 'fluent:speaker-off-16-filled' : 'fluent:speaker-2-32-filled'"
          class="text-xl"
        />
      </button>
    </div>

    <div class="absolute right-4 z-20 top-[30%]">
      <a
        href="https://faq.starface.chat"
        target="_blank"
        class="shadow bg-white block p-2 rounded-full"
      >
        <i-icon icon="emojione-v1:spiral-notepad" class="text-xl" />
      </a>
    </div>

    <!-- Popup to redeem coin  -->
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
            src="@/assets/img/icons/claim.webp"
            alt=""
            :class="isLoading ? 'heartbeat' : 'fadeIn'"
          />
          <span class="text-white text-sm mt-12">Tap to claim</span>
        </span>
      </div>
    </vDialog>

    <!-- Dropup for Comment and More Actions  -->
    <Sidebar
      v-model:visible="visibleBottom"
      :show-close-icon="false"
      position="bottom"
      class="max-h-80 h-full"
    >
      <div class="">
        <Comments
          v-if="actionable == 'comments'"
          :items="comments"
          :reel="reel"
          @refreshReel="refreshReel"
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
import Actions from '@/components/reels/Actions.vue'
import UserData from '@/components/reels/UserData.vue'
import WalletData from '@/components/utils/walletData.vue'
import Comments from '@/components/reels/Comments.vue'
import socket from '@/plugins/socket'
import Hls from 'hls.js'
export default {
  components: { Actions, UserData, WalletData, Comments },
  name: 'Reels',
  data() {
    return {
      videos: [], // List of videos
      videoLoaded: [], // Tracks video loading status
      videoError: [], // Tracks if a video fails to load
      loading: false, // Global loading state
      muteAll: false, // Global mute state for all videos
      userInteracted: false, // Tracks whether the user has interacted
      starBalance: {},
      isLoading: false, //Loader for coin
      showContainer: false,
      actionable: null,
      comments: [],
      reel: {},
      visibleBottom: false,
      lastThresholdHit: -1, // Prevent duplicate API calls
      currentPage: 1,
      totalPages: 1
    }
  },
  methods: {
    refreshReel(e) {
      this.getReel(e)
      // this.refresh()
    },

    // refresh() {
    //   this.$reels.list().then((res) => {
    //     this.videos = res.reels.map((video) => ({
    //       ...video,
    //       fallbackImage: video.fallbackImage || null // Add fallback image if available
    //     }))
    //   })
    // },

    getActionable(e) {
      this.visibleBottom = true
      let dataFromEntry = JSON.parse(e)
      this.actionable = dataFromEntry.e
      if (dataFromEntry.e == 'comments') {
        this.getReel(dataFromEntry.value._id)
      }
    },

    getReel(id) {
      this.$reels.get(id).then((res) => {
        // console.log(res)
        this.comments = res.reel.comments
        this.reel = res.reel
      })
    },

    openContainer() {
      this.showContainer = true
    },

    closeContainer() {
      this.showContainer = false
    },

    showContainerModified() {
      setTimeout(() => {
        this.openContainer() // Run the operation immediately
        // Then, schedule the repeated execution every 30 minutes (1,800,000 milliseconds)
        setInterval(this.openContainer, 600000)
      }, 60000) // 10 mi
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

    getEarnWallet() {
      if (!this.isLoggedIn) {
        return
      }
      this.$wallet.earnWallet().then((res) => {
        this.starBalance = res.star
      })
    },

    getReels(append = false) {
      let page = this.currentPage
      this.$reels
        .list({ page })
        .then((res) => {
          // console.log(res)
          if (res && res.reels) {
            const newReels = res.reels.map((video) => ({
              ...video,
              fallbackImage: video.fallbackImage || null // Add fallback image if available
            }))

            if (append) {
              this.videos = [...this.videos, ...newReels] // Append new reels
            } else {
              this.videos = newReels // Replace with initial reels
            }

            this.videos.forEach((reel) => {
              socket.emit('joinReelRoom', reel._id)
            })

            this.currentPage = res.currentPage
            this.totalPages = res.totalPages
            this.videoLoaded = Array(res.reels.length).fill(false)
            this.videoError = Array(res.reels.length).fill(false)

            // Trigger preloading for all videos
            // this.videos.forEach((video, index) => {
            //   const videoElement = document.createElement('video')
            //   videoElement.src = video.videoUrl
            //   videoElement.preload = 'auto'
            //   videoElement.addEventListener('loadeddata', () => this.handleLoaded(index))
            //   videoElement.addEventListener('error', () => this.handleVideoError(index))
            // })

            this.$nextTick(() => {
              if (this.videos) {
                this.videos.forEach((reel, index) => {
                  const videoElement = this.$refs.videoPlayers[index]
                  // console.log(videoElement, 'ommmo')
                  videoElement.addEventListener('loadeddata', () => this.handleLoaded(index))
                  videoElement.addEventListener('error', () => this.handleVideoError(index))
                  if (videoElement) {
                    if (Hls.isSupported()) {
                      const hls = new Hls()
                      hls.loadSource(reel.videoUrl)
                      hls.attachMedia(videoElement)
                    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                      videoElement.src = reel.videoUrl
                    } else {
                      console.error(`HLS not supported on video ${index + 1}`)
                    }
                  }
                })
              }
            })
          }
        })
        .catch((error) => {
          //   console.error('Error fetching reels:', error)
          return error
        })
        .finally(() => {
          // Attach IntersectionObserver
          this.$nextTick(() => {
            const videoContainers = this.$refs.videoContainer
            // console.log('Video containers observed:', videoContainers) // Add this log

            const options = {
              root: null,
              threshold: 0.4 // 40% visibility triggers
            }

            this.observer = new IntersectionObserver(this.handleIntersection, options)

            if (Array.isArray(videoContainers)) {
              videoContainers.forEach((el) => this.observer.observe(el))
            }
          })

          this.loading = false
        })
    },

    handleLoaded(index) {
      this.videoLoaded[index] = true
    },

    handleVideoError(index) {
      this.videoError[index] = true // Mark the video as errored
      //   console.error(`Video at index ${index} failed to load.`, {
      //     videoUrl: this.videos[index]?.url
      //   })
    },

    handleIntersection(entries) {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video')
        const index = parseInt(entry.target.dataset.index)

        if (entry.isIntersecting && video && !this.videoError[index]) {
          video.play().catch((error) => {
            // console.error('Error playing video:', error.message)
            this.handleVideoError(index)
            return error
          })

          // Check if we are nearing the end of the list and fetch more videos

          if (index >= this.videos.length - 4 && this.lastThresholdHit !== index) {
            this.lastThresholdHit = index // Avoid duplicate calls
            // console.log(this.currentPage, this.totalPages)
            this.nextPage()
          }
        } else if (video) {
          video.pause()
        }
      })
    },

    toggleMuteAll() {
      // Toggle the mute state for all videos
      this.muteAll = !this.muteAll
    },

    handleFallbackError(index) {
      // Handle the error when the fallback image itself fails to load
      //   console.error(`Fallback image for video at index ${index} failed to load.`)
      this.videoError[index] = true // Mark the video as errored
    },

    // Check if user is near the end
    handleScroll() {
      const scrollContainer = this.$el // Root element of the template
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 400 // Trigger 200px before the bottom
      ) {
        this.nextPage()
        // console.log(this.currentPage, this.totalPages)
      }
    },

    nextPage() {
      // console.log(this.currentPage, this.totalPages)
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
      return
    }
  },

  mounted() {
    this.loading = true
    // this.$el.addEventListener('scroll', this.handleScroll)
    this.getReels()
    this.getEarnWallet()
    this.showContainerModified()

    socket.on('reelUpdated', ({ reelId, updatedData }) => {
      // console.log(updatedData, reelId, 'updated data')
      this.videos = this.videos.map((reel) =>
        reel._id == reelId ? { ...reel, ...updatedData } : reel
      )
    })
  },

  unmounted() {
    // this.$el.removeEventListener('scroll', this.handleScroll)
    if (this.observer) this.observer.disconnect()
    socket.off('reelUpdated')
  },

  watch: {
    currentPage: {
      handler(val) {
        if (val) {
          this.getReels(true) // Load more reels
        }
      }
    }
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
html {
  scroll-behavior: smooth;
}
</style>
