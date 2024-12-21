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
              <!-- <Skeleton class="mb-2 h-8 w-[80px]"></Skeleton> -->
            </div>
            <Skeleton class="mb-2 rounded-none h-[300px]"></Skeleton>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col gap-3">
          <div class="feed-area dark:bg-black3 bg-gray-50 py-3">
            <!-- <div class="user p-2">
              <user-data :reelData="item" />
            </div> -->
            <div>
              <PostInfo :reelData="item" />
            </div>

            <div class="main-feed-area">
              <template v-if="item.postType == 'video'">
                <div class="relative">
                  <video
                    playsinline
                    loop
                    :muted="muted"
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
                      :icon="muted ? 'fluent:speaker-off-16-filled' : 'fluent:speaker-2-32-filled'"
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
          </div>

          <!-- Promote Post Area  -->

          <div class="px-2">
            <h3 class="font-semibold dark:text-white">Promotion Details</h3>
            <form @submit.prevent="onSubmit" class="form flex flex-col gap-2">
              <div>
                <label for="">Location</label>
                <input
                  type="text"
                  v-model="formData.targetLocation"
                  placeholder="Enter Location"
                  class="input dark:bg-white py-2"
                />
              </div>

              <div>
                <label for="">Amount (In USDT)</label>
                <input
                  type="text"
                  v-model="formData.amount"
                  placeholder="Enter Amount"
                  class="input dark:bg-white py-2"
                />
              </div>

              <div>
                <label for="">Number of Days</label>
                <input
                  type="text"
                  v-model="formData.duration"
                  placeholder="Number of Days"
                  class="input dark:bg-white py-2"
                />
              </div>

              <button class="brand-btn brand-primary-clear mt-3 w-full">Promote Post</button>
            </form>
          </div>
        </div>
      </template>
    </el-skeleton>
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

import { useRoute } from 'vue-router'
import { services } from '@/services/services'
import PostInfo from '@/components/reels/PostInfo.vue'

const $route = useRoute()

const item = ref({})
const videoInfo = ref(null)
const muted = ref(false)
const fetchingReels = ref(true)

const formData = ref({
  targetLocation: '', //City or country
  amount: '', // From USDT Balance
  duration: '' //In days
})

const toggleMute = () => {
  muted.value = !muted.value
}

const onSubmit = async () => {
  let payload = {
    ...formData.value,
    description: item.value.description,
    files: item.value.file[0].filepath //Optional Image or video
  }
  const ID = $route.params.id
  try {
    let req = await services.feeds.promote(ID, payload)
    // console.log(req)
    return req
  } catch (error) {
    console.log(error)
  }
  console.log(payload)
}

const getFeed = async () => {
  const ID = $route.params.id
  try {
    const req = await services.feeds.get(ID)
    item.value = req.post
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
})
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
