<template>
  <div class="pb-[80px]">
    <el-skeleton :loading="fetchingReels" animated>
      <template #template>
        <div class="flex flex-col gap-3">
          <div>
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
          <div class="feed-area dark:bg-black3 bg-gray-50 py-3">
            <div class="user p-2">
              <user-data :reelData="item" />
            </div>

            <div>
              <PostInfo :reelData="item" />
            </div>

            <div class="main-feed-area">
              <template v-if="item.postType == 'video'">
                <div class="relative">
                  <video
                    playsinline
                    loop
                    :muted='muted'
                    :src="item.file[0].filepath"
                    class="min-h-[200px] w-full"
                    @click="handleVideoTap(0)"
                    id="videoItem"
                    autoplay
                  ></video>
                  <button
                    class="bg-black absolute top-2 right-2 text-white p-2 bg-opacity-50 rounded-full"
                    @click="toggleMute"
                  >
                    <Icon
                      :icon="
                        muted ? 'fluent:speaker-off-16-filled' : 'fluent:speaker-2-32-filled'
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

    <div :class="{ dark: isDarkMode === 'dark' }">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import Skeleton from 'primevue/skeleton'
import Hls from 'hls.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Icon } from '@iconify/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Sidebar from 'primevue/sidebar'
import socket from '@/plugins/socket'
import { services } from '@/services/services'
import UserData from '@/components/reels/UserData.vue'
import Actions from '@/components/reels/Actions.vue'
import PostInfo from '@/components/reels/PostInfo.vue'
import Comments from '@/components/reels/Comments.vue'

const $route = useRoute()
const store = useStore()

const item = ref({})
const videoInfo = ref(null)
const muted = ref(false)
const isPlaying = ref([false])
const isPlayButtonVisible = ref([false])
const visibleBottom = ref(false)
const comments = ref([])
const reel = ref({})
const fetchingReels = ref(true)

const openComments = () => {
  visibleBottom.value = true
  comments.value = item.value.comments
  reel.value = item.value
}


const toggleMute = () => {
  muted.value = !muted.value
}

const getFeed = async () => {
  const ID = $route.params.id
  try {
    const req = await services.feeds.get(ID)
    item.value = req.post
    socket.emit('joinPostRoom', ID)
  } catch (error) {
    console.error('Error fetching feed:', error)
  } finally {
    fetchingReels.value = false
    nextTick(() => {
      videoInfo.value = document.getElementById('videoItem')
      console.log(document.getElementById('videoItem'))
      //   initializeVideo()
      if (item.value.postType == 'video' && Hls.isSupported()) {
        const videoElement = videoInfo.value
        // const videoElement =
        console.log(videoElement)
        if (videoElement) {
          // console.log(videoElement, 'Video element found')
          const hls = new Hls()
          hls.loadSource(item.value.file[0].filepath)
          hls.attachMedia(videoElement)
        } else {
          console.error('Video element is still null')
        }
      }
    })
  }
}

onMounted(() => {
  getFeed()
  socket.on('postUpdated', ({ postId, updatedData }) => {
    if (postId === item.value._id) {
      item.value = { ...item.value, ...updatedData }
    }
  })
})

onUnmounted(() => {
  socket.off('postUpdated')
})

const isDarkMode = computed(() => store.getters['getTheme'])
</script>

<style>
.swiper-pagination-bullet {
  height: 5px;
  width: 5px;
}
.swiper-pagination-bullet-active {
  background: var(--primary-color);
}
</style>
