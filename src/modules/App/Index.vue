<template>
  <div class="pb-[80px] h-[100vh] overflow-y-auto" @scroll="handleScroll">
    <el-skeleton :loading="fetchingReels" animated>
      <template #template>
        <div class="flex flex-col gap-3">
          <div class="" v-for="item in 6" :key="item">
            <div class="p-2 flex justify-between items-center">
              <div class="flex-1 flex gap-2 items-center">
                <span>
                  <Skeleton class="mb-2 h-12 w-12 rounded-full"></Skeleton>
                </span>
                <div class="w-full">
                  <Skeleton class="mb-1 h-3 w-9/12"></Skeleton>
                  <Skeleton class="h-2 w-4/12"></Skeleton>
                </div>
              </div>
              <Skeleton class="mb-2 h-8 w-[80px]"></Skeleton>
            </div>
            <Skeleton class="mb-2 rounded-none h-[300px]"></Skeleton>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col gap-3">
          <div
            class="feed-area dark:bg-black3 bg-gray-50 py-3"
            v-for="(item, idx) in allFeeds"
            :key="idx"
            @click="viewPost(item)"
          >
            <div class="user p-2">
              <user-data :reelData="item" />
            </div>

            <div>
              <PostInfo :reelData="item" />
            </div>

            <div class="main-feed-area">
              <template v-if="item.postType === 'video'">
                <div class="relative">
                  <video
                    playsinline
                    loop
                    :muted="muteAll"
                    ref="videoPlayers"
                    :src="item.file[0].filepath"
                    class="min-h-[200px] w-full"
                    @click.stop="handleVideoTap(idx)"
                  ></video>
                  <div
                    v-if="isPlayButtonVisible[idx]"
                    class="absolute inset-0 flex top-0 w-fit h-fit left-0 items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    @click.stop="togglePlayPause(idx)"
                  >
                    <button class="p-6 bg-black bg-opacity-30 text-white rounded-full">
                      <Icon :icon="isPlaying[idx] ? 'mdi:pause' : 'mdi:play'" class="text-3xl" />
                    </button>
                  </div>
                  <button
                    class="bg-black absolute top-2 right-2 text-white p-2 bg-opacity-50 rounded-full"
                    @click.stop="toggleMute"
                  >
                    <Icon
                      :icon="
                        muteAll ? 'fluent:speaker-off-16-filled' : 'fluent:speaker-2-32-filled'
                      "
                      class="text-xl"
                    />
                  </button>
                </div>
              </template>
              <template v-else>
                <Swiper
                  :slides-per-view="1"
                  :pagination="{ clickable: true }"
                  loop
                  :modules="[Pagination]"
                  class="h-full w-full"
                >
                  <SwiperSlide v-for="(obj, i) in item.file" :key="i">
                    <div class="relative">
                      <img
                        class="size-full object-cover h-[600px] w-full"
                        :src="obj.filepath"
                        :alt="'Hero Image ' + (i + 1)"
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </template>
            </div>

            <div class="actions">
              <actions @getActionable="openComments" :reelData="item" />
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <div :class="{ dark: isDarkMode == 'dark' }">
      <!-- Dropup for Comment and More Actions  -->
      <Sidebar
        v-model:visible="visibleBottom"
        position="bottom"
        class="max-h-[300px] h-full dark:bg-black3 bg-white"
      >
        <template #container="{ closeCallback }">
          <div class="p-4">
            <Comments :items="comments" :reel="reel" />
          </div>
        </template>
      </Sidebar>

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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, onUnmounted, computed } from 'vue'
import Skeleton from 'primevue/skeleton'
import Hls from 'hls.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Icon } from '@iconify/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'

import { useStore } from 'vuex'

import Sidebar from 'primevue/sidebar'

import socket from '@/plugins/socket'

import { services } from '@/services/services'
import UserData from '@/components/reels/UserData.vue'
import Actions from '@/components/reels/Actions.vue'
import PostInfo from '@/components/reels/PostInfo.vue'
import Comments from '@/components/reels/Comments.vue'
import { useRouter } from 'vue-router'

import { debounce } from 'lodash';
// import reels from '@/services/reels'

const $router = useRouter()
const store = useStore()

const allFeeds = ref([])
const videoPlayers = ref([]) // Reference to video elements
const isMuted = ref([]) // Tracks mute state for each video
const muteAll = ref(true) // Global mute state
const isPlaying = ref([]) // Tracks playing state for each video
const isPlayButtonVisible = ref([]) // Tracks visibility of play/pause buttons
const currentPage = ref(1) // Track current page for pagination
const totalPages = ref(1); // Example total pages
const loading = ref(false)
const visibleBottom = ref(false)
const comments = ref([])
const reel = ref({})
const isLoading = ref(false)
const showContainer = ref(false)
const fetchingReels = ref(true)

const initializeVideos = () => {
  console.log(videoPlayers.value)
  videoPlayers.value.forEach((videoElement, index) => {
    const reel = allFeeds.value[index]
    if (reel && reel.postType == 'video' && videoElement) {
      const videoUrl = reel.file[0]?.filepath
      if (Hls.isSupported() && videoUrl) {
        const hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(videoElement)
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = videoUrl
      } else {
        console.error(`HLS not supported on video ${index + 1}`)
      }
      // Explicitly pause all videos at initialization
      videoElement.pause()
    }
  })
}

const closeContainer = () => {
  showContainer.value = false
}

const redeem = () => {
  if (!isLoggedIn.value) {
    $router.push('/auth/login')
    return
  }
  isLoading.value = true
  services.wallet
    .redeem()
    .then((res) => {
      getEarnWallet()
      showContainer.value = false
      return res
    })
    .finally(() => {
      isLoading.value = false
    })
}

const getEarnWallet = () => {
  services.wallet.earnWallet().then((res) => {
    let starBalance = res.star
    console.log(res)
    store.commit('drawer/setStarBalance', starBalance)
  })
}

const openContainer = () => {
  showContainer.value = true
}

const showContainerModified = () => {
  setTimeout(() => {
    openContainer() // Run the operation immediately
    // Then, schedule the repeated execution every 30 minutes (1,800,000 milliseconds)
    setInterval(openContainer(), 600000)
  }, 60000) // 10 mi
}

const openComments = (e) => {
  visibleBottom.value = true
  let itemData = JSON.parse(e)
  console.log(itemData)
  comments.value = itemData.comments
  reel.value = itemData
}

// Toggle play/pause for individual videos
const togglePlayPause = (index) => {
  const video = videoPlayers.value[index]
  if (video) {
    if (isPlaying.value[index]) {
      video.pause()
    } else {
      video.play()
    }
    isPlaying.value[index] = !isPlaying.value[index]
  }
}

// Handle visibility of play button and prevent stopping of video
const handleVideoTap = (index) => {
  isPlayButtonVisible.value[index] = true
  // Hide the button after 5 seconds if the video is paused
  setTimeout(() => {
    if (!isPlaying.value[index]) {
      isPlayButtonVisible.value[index] = false
    }
  }, 5000)
}

// Toggle mute for all videos
const toggleMute = () => {
  muteAll.value = !muteAll.value
}

// Play videos when they come into view
const observeVideos = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target
        if (entry.isIntersecting) {
          video.play()
        } else {
          video.pause()
        }
      })
     
    },
    { threshold: 0.5 } // Play video when 50% visible
  )

  videoPlayers.value.forEach((video) => {
    if (video) {
      observer.observe(video)
    }
  })
}

const viewPost = (e) => {
  $router.push({ name: 'post-details', params: { id: e._id } })
}

const getFeeds = async (append = false) => {
  if (loading.value) return // Prevent multiple requests while loading
  let payload = { page: currentPage.value }
  try {
    let req = await services.feeds.list(payload)
    if (append) {
      allFeeds.value = [...allFeeds.value, ...req.posts]
    } else {
      allFeeds.value = req.posts
    }
    isMuted.value = req.posts.map(() => muteAll.value) // Initialize mute state for all videos
    isPlaying.value = req.posts.map(() => true) // Initialize playing state for all videos
    isPlayButtonVisible.value = req.posts.map(() => false) // Initialize play button visibility
    currentPage.value = req.currentPage
    totalPages.value = req.totalPages

    allFeeds.value.forEach((reel) => {
      socket.emit('joinPostRoom', reel._id)
    })

    
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    fetchingReels.value = false
    nextTick(() => {
      videoPlayers.value = document.querySelectorAll('video')
      initializeVideos()
      observeVideos()
    })
  }
}

// Handle the scroll event for infinite scroll
const handleScroll = debounce((event) => {
  const scrollContainer = event.target;
  const scrollPosition = scrollContainer.scrollTop + scrollContainer.clientHeight;
  const scrollHeight = scrollContainer.scrollHeight;

  // Log to debug
  console.log("Scroll Position:", scrollPosition);
  console.log("Scroll Height:", scrollHeight);

  // Check if we are near the bottom of the scroll container
  if (scrollPosition >= scrollHeight - 100 && !loading.value) {
    console.log("Near bottom, loading more posts...");
    loadMorePosts();
  }
}, 300); // 300ms debounce

const loadMorePosts = () => {
  currentPage.value += 1
  getFeeds(true)
}

onMounted(() => {
  fetchingReels.value = true
  showContainerModified()
  getFeeds()
  socket.on('postUpdated', ({ postId, updatedData }) => {
    console.log(updatedData, postId, 'updated data')
    allFeeds.value = allFeeds.value.map((reel) =>
      reel._id == postId ? { ...reel, ...updatedData } : reel
    )
    comments.value = allFeeds.value.find((item) => item._id == [postId]).comments
  })
})

const isDarkMode = computed(() => {
  // console.log(store.getters['getTheme'])
  return store.getters['getTheme']
})

const isLoggedIn = computed(() => {
  return store.getters['auth/getAuthenticated']
})

onUnmounted(() => {
  socket.off('postUpdated')
})
</script>

<style>
.swiper-pagination-bullet {
  height: 5px;
  width: 5px;
}
.swiper-pagination-bullet-active {
  background: var(---primary-color);
}
</style>
