<template>
  <div class="reels-page p-4">
    <!-- <div class="bg-white">
      Hello World. this is the space for search
    </div> -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="flex flex-col w-full gap-4">
          <el-skeleton-item variant="image" class="skeleton-slide" />
        </div>
      </template>
      <template #default>
        <swiper :modules="[EffectCards]" effect="cards" grabCursor>
          <swiper-slide v-for="(item, i) in images" :key="i">
            <div class="card-wrapper">
              <img
                class="rounded-[10px] swiper-img"
                :src="item.profilePicture ? item.profilePicture : $avatar"
                @error="$handleImageError"
                alt="Image"
              />
              <div class="overlay">
                <div class="flex flex-col gap-2 p-4">
                  <button class="brand-btn-md brand-outline text-white w-fit">
                    <router-link :to="`/user/profile/${item._id}`"> View More </router-link>
                  </button>
                  <h4 class="font-semibold text-xl text-white">{{ item.userName }}</h4>
                  <div class="flex gap-2">
                    <button class="brand-btn-md brand-outline text-white" @click="likeImage(item)">
                      {{ checkLiked(item) ? 'Unlike' : 'like' }}
                    </button>
                    <button class="brand-btn-md brand-outline text-white" @click="startChat(item)">
                      Chat
                    </button>
                    <button
                      class="brand-btn-md brand-outline text-white"
                      @click="followAction(item)"
                    >
                      {{ checkFollowing(item) ? 'Unfollow' : 'Follow' }}
                    </button>
                  </div>
                </div>
                <!-- <button class="brand-primary brand-btn rounded-full shadow">
                  <star-icon />
                </button> -->
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
// import StarIcon from '@/components/UI/StarIcon.vue';

export default {
  components: {
    Swiper,
    SwiperSlide
    // StarIcon,
  },
  data() {
    return {
      loading: true,
      images: [],
      EffectCards
    }
  },
  methods: {
    async getConnect(value) {
      if (!value) this.loading = true
      try {
        const res = await this.$appImages.connect()
        this.images = res.users
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        this.loading = false
      }
    },

    checkLiked(e) {
      return e.following.includes(this.user._id)
    },

    likeImage(e) {
      let payload = {
        targetUserId: e._id, //like, unlike, favorite, unfavorite, follow, unfollow
        action: this.checkLiked(e) ? 'unlike' : 'like'
      }
      this.$userActivity.toggleUserActions(payload).then(() => {
        this.getUser()
        this.getConnect('value')
      })
    },

    startChat(e) {
      let payload = {
        userId: this.user._id,
        recipientId: e._id
      }
      this.$chat.startChat(payload).then((res) => {
        console.log(res)
        this.$router.push(`chat/message/${res._id}?uid=${e._id}`)
      })
      // http://localhost:5173/chat/message/6741ea01be0c5fe2c3ecb0f2?uid=6719073ad1f3a149b460412e
    },

    followAction(e) {
      let payload = {
        targetUserId: e._id, //like, unlike, favorite, unfavorite, follow, unfollow
        action: this.checkFollowing(e) ? 'unfollow' : 'follow'
      }
      this.$userActivity.toggleUserActions(payload).then(() => {
        this.getUser()
        this.getConnect('value')
      })
    },

    async getUser() {
      try {
        const res = await this.$auth.getUser(this.user._id)
        this.$store.commit('auth/setUser', res.user)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },

    checkFollowing(item) {
      return this.user.following.includes(item._id)
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },
    isLoggedIn() {
      return this.$store.getters['auth/getAuthenticated']
    }
  },
  mounted() {
    this.getConnect()
  }
}
</script>

<style scoped>
.reels-page {
  background-color: #000;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.swiper-img {
  object-fit: cover;
  width: 100%;
  height: calc(100vh - 300px); /* Adjust to match overlay height */
}
.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 300px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.skeleton-slide {
  height: 100vh;
  border-radius: 10px;
  width: 100%;
}
</style>
