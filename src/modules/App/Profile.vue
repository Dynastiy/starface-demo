<template>
  <div class="flex gap-6 p-4 pb-[80px] items-start lg:flex-row md:flex-row flex-col">
    <div
      class="bg-white dark:bg-black3 p-4 lg:w-6/12 md:w-6/12 w-full rounded-md flex justify-center"
    >
      <div class="w-full">
        <div
          @click="logout"
          role="button"
          class="flex gap-1 justify-end items-center text-red-500 text-[14px]"
        >
          <i-icon icon="humbleicons:logout" />
          <span class="font-medium">Logout</span>
        </div>

        <div class="relative w-fit mx-auto">
          <img
            :src="userData.profilePicture ? userData.profilePicture : $avatar"
            @error="$handleProfileError"
            class="w-[100px] h-[100px] mx-auto border-2 p-1 dark:border-black2 border-gray-200 rounded-full object-fit object-top relative"
          />
          <input
            type="file"
            name="file"
            id="profilePhotoInput"
            class="hidden-input"
            ref="file"
            accept=".png,.jpg,.jpeg,.webp,.svg"
            @change="uploadPhoto"
          />
          <label
            for="profilePhotoInput"
            class="file-label mb-0 flex flex-col items-center bg-primary text-white p-[8px] rounded-full absolute right-0 bottom-0"
          >
            <i-icon
              :icon="isUploading ? 'line-md:downloading-loop' : 'lucide:images'"
              class="text-[15px]"
            />
          </label>
        </div>

        <div class="">
          <h5
            class="text-lg justify-center dark:text-gray-100 font-bold mt-2 flex gap-1 items-center"
          >
            {{
              userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : ''
            }}
            <span class="text-[12px] dark:text-gray-400">
              {{ `@${userData.userName}` }}
            </span>
            <router-link
              to="/profile/edit"
              class="block text-primary flex items-center gap-1 justify-center text-sm gap-2 font-medium underline text-center"
            >
              <i-icon icon="iconamoon:edit-duotone"
            /></router-link>
          </h5>
        </div>
        <h6 class="text-center dark:text-gray-200 text-[12px] text-center mb-2">
          {{ `${userData.email}` }}
        </h6>

        <h6 class="text-center text-[14px] dark:text-gray-200 capitalize text-center mb-2">
          {{ `Status | ${userData.role}` }}
          <span class="text-xs text-primary underline"
            ><router-link to="/become-a-creator">Become a Creator</router-link></span
          >
        </h6>

        <span class="flex gap-1 justify-center dark:text-gray-200" v-if="userData.hasCountry">
          <i-icon icon="ic:baseline-location-on" />
          <span class="text-xs">{{ userData.countryName }}</span>
        </span>

        <div class="flex gap-2 w-full mt-4">
          <span
            class="bg-gray-100 dark:bg-black1 dark:text-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center"
          >
            <i-icon icon="noto:glowing-star" />
            <span class="text-xs">{{ likes }} Likes</span>
          </span>

          <!-- <span class="bg-gray-100 dark:bg-black1 dark:text-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center">
            <i-icon icon="solar:bell-bold" />
            <span class="text-xs">0 Views</span>
          </span> -->

          <span
            class="bg-gray-100 dark:bg-black1 dark:text-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center"
          >
            <i-icon icon="ic:baseline-rocket-launch" />
            <span class="text-xs">{{ following }} Following</span>
          </span>

          <span
            class="bg-gray-100 dark:bg-black1 dark:text-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center"
          >
            <i-icon icon="solar:bell-bold" />
            <span class="text-xs">{{ followers }} Followers</span>
          </span>
        </div>
        <div class="flex gap-3 mt-4 w-full">
          <button
            class="brand-btn brand-primary-clear py-2 text-xs w-full"
            @click="$router.push('/wallet')"
          >
            My Wallet
          </button>
          <button
            class="brand-btn brand-primary-clear py-2 text-xs w-full"
            @click="$router.push('/invite')"
          >
            Invite Friends
          </button>
          <a
            class="w-full"
            target="_blank"
            href="https://pancakeswap.finance/?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x6AC86549e40edc13EC8A884756Afa019942EE92b"
          >
            <button class="brand-btn brand-primary-clear py-2 text-xs">Trade Starface</button>
          </a>
        </div>
      </div>
    </div>

    <div class="w-full">
      <!-- <span class="flex mx-auto mb-3 bg-gray-200 w-fit">
        <span
          class="block px-3 py-2 text-[12px] capitalize font-medium"
          role="button"
          @click="activateTab(i)"
          :class="{ 'brand-primary-clear text-white font-semibold': i === activeTab }"
          v-for="(item, i) in tabs"
          :key="i"
        >
          {{ item.label }}
        </span>
      </span> -->

      <span class="flex block relative">
        <span
          @click="activateTab(i)"
          :class="[
            activeTab == i
              ? 'dark:text-white dark:border-b-white border-b-primary text-primary'
              : 'dark:text-gray-500 dark:border-b-gray-500 text-gray-600',
            'border-b pb-1 border-b-2 font-semibold capitalize text-[14px] w-full text-center'
          ]"
          v-for="(item, i) in tabs"
          :key="i"
        >
          <span class="flex gap-2 justify-center items-center">
            <i-icon :icon="item.icon" />
            {{ item.label.split('_').join(' ') }}
          </span>
        </span>
      </span>

      <div class="mt-4">
        <div class="flex gap-2 flex-col">
          <div class="grid grid-cols-3 gap-1">
            <div v-for="(item, index) in posts" :key="index">
              <div class="relative" v-if="item.postType == 'image' && activeTab !== 2">
                <img
                  @click="view(item)"
                  class="rounded-sm h-[80px] w-full object-cover object-center"
                  @error="$handleImageError"
                  :src="item.file[0].filepath"
                  alt=""
                />
                <span v-if="item.file.length > 1" class="absolute top-1 text-white right-1">
                  <i-icon icon="tabler:box-multiple-filled" />
                </span>
              </div>
              <div v-if="item.postType == 'video' && activeTab !== 1" class="relative">
                <video
                  @click="view(item)"
                  class="rounded-sm h-[80px] w-full object-cover object-center"
                  v-if="!item.hasError"
                  @error="handleVideoError(index)"
                  muted
                  :src="item?.file[0].filepath"
                  :id="'video-player-' + index"
                  ref="videoPlayers"
                ></video>
                <img
                  v-else
                  @click="view('video', item)"
                  @error="$handleImageError"
                  :src="item.thumbnailUrl"
                  alt="Placeholder"
                  class="h-[80px] w-full object-cover object-center"
                />
                <span v-if="item.postType == 'video'" class="absolute top-1 text-white right-1">
                  <i-icon icon="icon-park-outline:video" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import image from '@/assets/img/no-user.png'
// import videojs from "video.js";
import Hls from 'hls.js'
export default {
  // components: { Edit, Transactions },
  data() {
    return {
      image,
      form: {
        first_name: '',
        last_name: '',
        phone_number: '',
        country: '',
        region_state_province: '',
        city: '',
        bio: '',
        date_of_birth: '',
        gender: '',
        profile_picture_url: ''
      },
      tabs: [
        {
          label: 'all_posts',
          icon: 'material-symbols:border-all-outline'
          // component: markRaw(Edit)
        },
        {
          label: 'photos',
          icon: 'clarity:image-gallery-line'
          // component: markRaw(Edit)
        },
        {
          label: 'videos',
          icon: 'streamline:play-list-9'
          // component: markRaw(Transactions)
        }
        // {
        //   label: 'referral',
        //   component: markRaw(Referral)
        // }
      ],
      activeTab: 0,
      likes: 0,
      views: 0,
      followers: 0,
      following: 0,
      isUploading: false,
      showContainer: false,
      type: null,
      posts: []
    }
  },

  methods: {
    view(e) {
      // console.log(e)
      this.$router.push({ name: 'post-details', params: { id: e._id } })
    },

    deleteRecord() {
      this.$swal
        .fire({
          title: 'Uhhhh! 😔',
          text: 'Complete Delete process?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete!'
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.completeDelete()
          }
        })
    },

    completeDelete() {
      // this.isDeleting == true
      if (this.type == 'video') {
        this.$reels.delete(this.item.videoId).then(() => {
          this.closeContainer()
          this.getPosts()
        })
        return
      }

      if (this.type == 'image') {
        this.$appImages.delete(this.item.ImageId).then(() => {
          this.closeContainer()
          this.getPosts()
        })
      }
    },

    closeContainer() {
      this.showContainer = false
    },

    activateTab(e) {
      this.activeTab = e
    },

    handleVideoError(index) {
      this.posts[index].hasError = true
    },

    getLikes() {
      this.$userActivity.views().then((res) => {
        console.log(res)
        this.likes = res.totalLikes
        this.views = this.totalViews
      })
    },
    getUser() {
      this.$auth.getUser(this.userData._id).then((res) => {
        console.log(res)
        this.$store.commit('auth/setUser', res.user)
        return res
      })
    },

    getFollowCount() {
      this.$userActivity.followCount().then((res) => {
        console.log(res)
        this.followers = res.followerCount
        this.following = res.followingCount
      })
    },

    getEarnWallet() {
      this.$wallet.earnWallet().then((res) => {
        console.log(res)
      })
    },

    getPosts() {
      this.$userActivity.allPosts(this.user._id).then((res) => {
        console.log(res)
        this.posts = res.posts
        this.$nextTick(() => {
          if (this.posts) {
            this.posts.forEach((reel, index) => {
              const videoElement = this.$refs.videoPlayers[index]
              if (videoElement) {
                if (Hls.isSupported()) {
                  const hls = new Hls()
                  hls.loadSource(reel.file[0].filepath)
                  hls.attachMedia(videoElement)
                } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                  videoElement.src = reel.file[0].filepath
                } else {
                  console.error(`HLS not supported on video ${index + 1}`)
                }
              }
            })
          }
        })
      })
    },

    getProfileData() {
      this.isLoading = true
      const request1 = this.getLikes()
      const request2 = this.getFollowCount()
      const request3 = this.getEarnWallet()
      const request4 = this.getPosts()
      const request5 = this.getUser()
      Promise.all([request1, request2, request3, request4, request5]).finally(() => {
        this.isLoading = false
      })
    },

    uploadPhoto() {
      const input = event.target
      let image = input.files[0]
      this.isUploading = true
      let formdata = new FormData()
      formdata.append('profilePicture', image)

      this.$auth
        .updateProfilePhoto(formdata)
        .then((res) => {
          this.getUser()
          return res
        })
        .finally(() => {
          this.isUploading = false
        })
    },

    logout() {
      this.$swal
        .fire({
          title: 'Uhhhh! 😔',
          text: 'Are you sure you want to log out?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, logout!'
        })
        .then((result) => {
          console.log(result, 'kkk')
          if (result.isConfirmed) {
            this.userLogout()
          }
        })
    },

    userLogout() {
      this.$store.dispatch('auth/logout')
      this.$swal
        .fire({
          title: 'Woo hoo 😫',
          text: 'Logged out succesfully',
          icon: 'success',
          confirmButtonText: 'Ok!'
        })
        .then((result) => {
          console.log(result, 'kkk')
          if (result.isConfirmed) {
            this.$router.go()
          }
        })
    }
  },

  watch: {
    showContainer(newVal) {
      if (newVal && this.type === 'video' && Hls.isSupported()) {
        this.$nextTick(() => {
          const videoElement = this.$refs.videoInfo
          if (videoElement) {
            // console.log(videoElement, 'Video element found')
            const hls = new Hls()
            hls.loadSource(this.item?.videoUrl)
            hls.attachMedia(videoElement)
          } else {
            console.error('Video element is still null')
          }
        })
      }
    }
  },

  mounted() {},

  beforeMount() {
    this.getProfileData()
  },

  computed: {
    userData() {
      return this.user
    },
    user() {
      return this.$store.getters['auth/getUser']
    },
    userMeta() {
      return this.$store.getters['auth/getUserMeta']
    },
    timeLeft() {
      return (
        this.userMeta.subscription_fee_expiration_time_of_last_payment -
        this.userMeta.subscription_fee_transaction_time_of_last_payment
      )
    }
  }
}
</script>

<style>
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.file-label {
  font-size: 20px;
  display: block;
  cursor: pointer;
}
</style>
