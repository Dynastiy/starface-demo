<template>
  <div class="reels-page">
    <el-skeleton style="width: 100%" :loading="loading" animated>
      <template #template>
        <div class="">
          <div class="flex flex-col w-full gap-4">
            <el-skeleton-item
              variant="image"
              style="height: 55vh; border-radius: 10px; width: 100%"
            />
            <el-skeleton-item
              variant="text"
              style="height: 20px; border-radius: 10px; width: 40%"
            />
            <el-skeleton-item
              variant="text"
              style="height: 20px; border-radius: 10px; width: 50%"
            />
            <el-skeleton-item
              variant="text"
              style="height: 20px; border-radius: 10px; width: 80%"
            />
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <wallet-data class="z-1" />
          <!-- <wallet-data -->
          <div class="reel-container" v-for="(item, index) in reels" :key="index">
            <video class="reel-video" :src="item.videoUrl" loop autoplay muted></video>
            <div class="inner-content">
              <div class="reel-section">
                <div>
                  <div class="user-info flex gap-2 items-center">
                    <img
                      class="h-[35px] w-[35px] rounded-full ring ring-[#fff]"
                      :src="item.thumbnailUrl"
                      @error="$handleProfileError"
                      alt=""
                    />
                    <span> {{ `@${item.userName}` }} </span>
                    <button class="brand-btn-md brand-outline text-white">follow</button>
                  </div>
                  <p class="mt-2 text-sm">{{item.description}}</p>
                </div>
                <div class="reel-actions flex flex-col gap-4">
                  <span class="flex gap-1 items-center flex-col">
                    <i-icon class="text-[30px]" icon="icon-park-outline:like" />
                    <span class="text-xs">{{ item.likes }}</span>
                  </span>
                  <span class="flex gap-1 items-center flex-col" role="button">
                    <i-icon
                      class="text-[25px]"
                      icon="fontisto:comment"
                      @click="viewMore('comments', item)"
                    />
                    <span class="text-xs">{{ item.comments.length }}</span>
                  </span>
                  <span class="flex gap-1 items-center flex-col">
                    <i-icon class="text-[25px]" icon="fa6-solid:share" />
                    <span class="text-xs">{{ item.shares }}</span>
                  </span>
                  <span
                    class="flex gap-1 items-center flex-col"
                    role="button"
                    @click="viewMore('view')"
                  >
                    <i-icon class="text-[25px]" icon="uis:ellipsis-h" />
                  </span>
                  <span class="flex gap-1 items-center flex-col" role="button">
                    <i-icon class="text-[35px]" icon="noto-v1:sunflower" />
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
        <span
          role="button"
          @click="closeContainer"
          class="flex flex-col items-center justify-center w-full"
        >
          <!-- <i-icon icon="fluent-emoji-flat:coin" class="text-[200px]" /> -->
          <img src="@/assets/img/icons/coin_claim.png" alt="" />
          <span class="text-white text-xs">Tap to claim</span>
        </span>
      </div>
    </vDialog>

    <Sidebar
      v-model:visible="visibleBottom"
      :show-close-icon="false"
      position="bottom"
      class="max-h-80 h-full"
    >
      <template #header>
        <div class="flex w-full justify-between">
          <h4 v-if="actionable == 'comments'" class="font-semibold">Comments</h4>
          <span class="text-red-500 ml-auto block" role="button" @click="visibleBottom = false">
            <i-icon icon="iconamoon:close" class="text-2xl" />
          </span>
        </div>
      </template>
      <div>
        <div class="h-full">
          <comments v-if="actionable == 'comments'" :items="comments" />
        </div>
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
      comments: []
    }
  },

  methods: {
    getReels() {
      this.$reels.list().then((res) => {
        console.log(res)
        this.reels = res.reels
      })
    },

    getReel(id) {
      this.$reels.get(id).then((res) => {
        console.log(res)
        this.comments = res.reel.comments
      })
    },

    viewMore(e, value) {
      this.visibleBottom = true
      this.actionable = e
      console.log(value)
      this.getReel(value._id)
      // this.comments = value
    },

    like(e) {
      let payload = {
        user_id_to_connect: e.ID,
        user_id: this.user.user_id
      }
      this.$appDomain.likeMatch(payload).then((res) => {
        console.log(res)
      })
      // .finally(() => {
      //   this.loading = false
      // })
    },

    timeLeft(value) {
      return (
        value.subscription_fee_expiration_time_of_last_payment -
        value.subscription_fee_transaction_time_of_last_payment
      )
    },

    next() {
      this.filter.page_no++
      this.getMatch()
    },

    prev() {
      if (this.meta.current_page > 1) {
        this.filter.page_no--
        this.getMatch()
      }
    },

    // Method to display the container at a random time
    showContainerAtRandomTime() {
      // Clear any existing timer
      clearTimeout(this.timer)

      // Set a new random time between 1 and 60 seconds
      const randomTime = Math.floor(Math.random() * 60000)

      // Set a timeout to show the container
      this.timer = setTimeout(() => {
        // this.showContainer = true
        console.log('alert')
      }, randomTime)
    },
    // Method to close the container and restart the process
    closeContainer() {
      this.showContainer = false
      this.showContainerAtRandomTime()
    }
  },

  beforeMount() {
    this.getReels()
  },

  mounted() {
    // Start the process when the component is mounted
    this.showContainerAtRandomTime()
  },

  beforeUnmount() {
    // Clear the timer when the component is destroyed
    clearTimeout(this.timer)
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    }
  }
}
</script>

<style scoped>
.reels-page {
  background-color: #000;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  width: 100%;
}

.reel-container {
  align-items: center;
  display: flex;
  height: 100vh;
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
