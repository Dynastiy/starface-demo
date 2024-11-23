<template>
  <div class="reels-page p-4">
    <el-skeleton style="width: 100%" :loading="loading" animated>
      <template #template>
        <div class="">
          <div class="flex flex-col w-full gap-4">
            <el-skeleton-item
              variant="image"
              style="height: 100vh; border-radius: 10px; width: 100%"
            />
            <!-- <el-skeleton-item
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
            /> -->
          </div>
        </div>
      </template>
      <template #default>
        <div class="">
          <swiper :effect="'cards'" :grabCursor="true" :modules="modules">
            <swiper-slide v-for="(item, i) in images" :key="i">
              <img
                class="rounded-[10px] swiper-img"
                :src="item.imageUrl"
                @error="$handleImageError"
                alt=""
              />
              
              <div class="overlay p-4">
                <div class="flex flex-col gap-1">
                  <button class="brand-btn-md brand-outline text-white w-fit">
                    <router-link :to="`/user/profile/${item.userId}`">View More</router-link>
                  </button>
                  <h4 class="font-semibold text-xl">{{ item.userName }}</h4>
                  <div class="flex gap-2">
                    <button class="brand-btn-md brand-outline text-white" @click="likeImage(item)">Like</button>
                    <button class="brand-btn-md brand-outline text-white" @click="startChat(item)">
                      Chat
                    </button>
                    <button class="brand-btn-md brand-outline text-white" @click="followAction(item)">{{ checkFollowing(item) ? "Following" : "Follow"}}</button>
                  </div>
                </div>
                <button class="brand-primary brand-btn rounded-full shadow">
                  <!-- <i-icon icon="twemoji:glowing-star" class="text-2xl text-white" /> -->
                  <star-icon />
                </button>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <!-- <div class="flex flex-col gap-4" v-for="(item, i) in images" :key="i">
          <div
            class="h-screen rounded-[10px] bg-cover bg-top flex px-4 py-[100px] items-end"
            :style="`background: url(${item})`"
          >
            <div class="flex flex-col gap-3">
              <h4>Harleen, 24</h4>
            </div>
            <div class="flex items-center justify-center gap-6 w-full">
              <span
                role="button"
                @click="prev"
                class="brand-primary block rounded-[8px] p-4 text-xl text-white w-fit shadow"
              >
                <i-icon icon="charm:arrow-left" />
              </span>
              <span
                class="bg-white block rounded-[8px] p-4 text-xl text-secondary w-fit shadow"
                role="button"
                @click="like(item)"
              >
                <i-icon icon="icon-park-solid:like" />
              </span>
              <span
                role="button"
                @click="next"
                class="brand-primary block rounded-[8px] p-4 text-xl text-white w-fit shadow"
              >
                <i-icon icon="charm:arrow-right" />
              </span>
            </div>
          </div>
        </div> -->
      </template>
    </el-skeleton>
  </div>
</template>

<script>
//   import walletData from '@/components/utils/walletData.vue'
// import { useToast } from 'vue-toastification'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/effect-cards'

// import './style.css';

// import required modules
import { EffectCards } from 'swiper/modules'
import StarIcon from '@/components/UI/StarIcon.vue'
export default {
  // components: { walletData },
  components: {
    Swiper,
    SwiperSlide,
    StarIcon
  },
  data() {
    return {
      modules: [EffectCards],
      filter: {
        per_page: 1,
        page_no: 1
      },
      images: [],
      meta: {},
      loading: false
    }
  },

  methods: {
    getConnect() {
      this.loading = true
      this.$appImages
        .connect()
        .then((res) => {
          console.log(res)
          let resData = res.data
          const allImages = []
          resData.forEach((element) => {
            let newData = {
              ...element,
              imageUrl: element.filepaths[0]
            }
            allImages.push(newData)
          })
          this.images = allImages
          console.log(allImages)
        })
        .finally(() => {
          this.loading = false
        })
    },

    startChat(item) {
      console.log(item)
      let payload = {
        userId: this.user._id,
        recipientId: item.userId
      }
      this.$chat.startChat(payload).then((res) => {
        console.log(res)
        this.$router.push(`/chat/message/${res._id}?uid=${item.userId}`)
      })
      // console.log(payload)
    },

    followAction(e) {
      if (!this.checkFollowing(e))  this.follow(e);
      return
    },

    unfollow(e) {
      console.log(e, 'unfollow');
      let payload = {
        unfollowId: e.userId
      }
      this.$userActivity.unfollowfollowFunc(payload)
      .then((res)=> {
        console.log(res)
        this.getUser()
      })
    },

    follow(e) {
      console.log(e, 'follow');
      let payload = {
        followId: e.userId
      }
      this.$userActivity.followFunc(payload)
      .then((res)=> {
        console.log(res)
        this.getUser()
      })
    },

    likeImage(e) {
      this.$userActivity.likeImage(e.imageId).then((res) => {
        console.log(res)
      })
    },

    getUser() {
      this.$auth.getUser(this.user._id).then((res) => {
        console.log(res)
        this.$store.commit('auth/setUser', res.user)
        return res
      })
    },

    getBackgroundStyle(image) {
      const img = new Image()
      img.src = image
      return {
        backgroundImage: `url('${
          img.complete && img.naturalWidth !== 0 ? image : this.$placeholder
        }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    },

    checkFollowing(e) {
      let following = this.user.following
      let isFollowing = following.find(item => item == e.userId )
      return isFollowing
      // console.log(isFollowing)
    }
  },

  beforeMount() {
    this.getConnect()
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    }
  }
}
</script>

<style scoped>
.swiper-img  {
  height: 100%;
  object-position: center;
  object-fit: cover;
}

.reels-page {
  background-color: #000;
  /* height: 100dvh; */
  overflow-y: hidden;
  /* scroll-snap-type: y mandatory; */
  width: 100%;
  overflow-x: hidden;
}

.swiper-card {
  /* min-height: calc(100vh - 90px); */
}

.swiper {
  width: 100%;
  position: relative;
  /* height: 320px; */
  height: calc(100vh - 90px);
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-weight: bold;
  color: #fff;
}

.overlay {
  position: absolute;
  bottom: 0;
  /* padding: 15px 200px; */
  left: 0;
  width: 100%;
  min-height: 300px; /* Adjust height as needed */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent); /* Smooth blend */
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.overlay-content {
  color: white;
  padding: 10px;
  text-align: center;
}
</style>
