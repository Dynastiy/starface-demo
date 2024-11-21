<template>
  <div class="flex gap-6 p-4 items-start lg:flex-row md:flex-row flex-col">
    {{ userData }}
    <div class="bg-white p-4 lg:w-6/12 md:w-6/12 w-full rounded-md flex justify-center">
      <div class="w-full">
        <img
          src="http://test.starface.chat/assets/images/avatar/6.jpg"
          class="w-[100px] h-[100px] mx-auto border-2 p-1 border-gray-200 rounded-full object-fit object-top"
        />
        <div class="">
          <h5 class="text-lg justify-center font-bold mt-2 flex gap-1 items-center">
            {{ `${userData.firstName} ${userData.lastName}` }}
            <span class="text-xs">
              {{ `@${userData.userName}` }}
            </span>
          </h5>
        </div>
        <h6 class="text-center text-[13px] text-center mb-2">
          {{ `@${userData.email}` }}
        </h6>
        <span class="flex gap-1 justify-center">
          <i-icon icon="ic:baseline-location-on" />
          <span class="text-xs">{{ userData.countryName }}</span>
        </span>

        <div class="flex gap-2 w-full mt-4">
          <span class="bg-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center">
            <i-icon icon="noto:glowing-star" />
            <span class="text-xs">{{ likes }} Likes</span>
          </span>

          <!-- <span class="bg-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center">
            <i-icon icon="solar:bell-bold" />
            <span class="text-xs">0 Views</span>
          </span> -->

          <span class="bg-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center">
            <i-icon icon="ic:baseline-rocket-launch" />
            <span class="text-xs">{{ following }} Following</span>
          </span>

          <span class="bg-gray-100 px-2 w-full rounded-md flex flex-col gap-1 py-2 items-center">
            <i-icon icon="solar:bell-bold" />
            <span class="text-xs">{{ followers }} Followers</span>
          </span>
        </div>
        <div class="flex gap-4 mt-4 w-full">
          <button
            class="brand-btn brand-primary py-2 text-xs w-full "
            @click="$router.push('/wallet')"
          >
            My Wallet
          </button>
          <button
            class="brand-btn brand-primary py-2 text-xs w-full "
            @click="$router.push('/invite')"
          >
            Invite Friends
          </button>
        </div>
      </div>
    </div>

    <div class="w-full">
      <span class="flex mx-auto mb-3 bg-gray-200 w-fit">
        <span
          class="block px-3 py-2 text-[12px] capitalize font-medium"
          role="button"
          @click="activateTab(i)"
          :class="{ 'brand-primary text-white font-semibold': i === activeTab }"
          v-for="(item, i) in tabs"
          :key="i"
        >
          {{ item.label }}
        </span>
      </span>
      <div class="bg-white p-6">
        <div>
          <img src="" alt="" />
          <video src=""></video>
        </div>
        <!-- <component :is="tabs[activeTab].component" /> -->
      </div>
    </div>
  </div>
</template>

<script>
// import Edit from '@/components/profile/Edit.vue'
// import Transactions from '@/components/profile/Transactions.vue'
// import Referral from '@/components/profile/Referral.vue'
// import { markRaw } from 'vue'
import image from '@/assets/img/no-user.png'

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
          label: 'all'
          // component: markRaw(Edit)
        },
        {
          label: 'photos'
          // component: markRaw(Edit)
        },
        {
          label: 'videos'
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
      following: 0
    }
  },

  methods: {
    activateTab(e) {
      this.activeTab = e
    },

    getLikes() {
      this.$userActivity.views().then((res) => {
        console.log(res)
        this.likes = res.totalLikes
        this.views = this.totalViews
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
      this.$userActivity.allPosts().then((res) => {
        console.log(res)
      })
    },

    getProfileData() {
      this.isLoading = true
      const request1 = this.getLikes()
      const request2 = this.getFollowCount()
      const request3 = this.getEarnWallet()
      const request4 = this.getPosts()
      Promise.all([request1, request2, request3, request4]).finally(() => {
        this.isLoading = false
      })
    }
  },

  watch: {},

  beforeMount() {
    // this.getUser()
    this.getProfileData()
  },

  computed: {
    userData() {
      return this.user.existingUser
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

<style></style>
