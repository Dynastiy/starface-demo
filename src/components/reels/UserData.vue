<template>
  <div>
    <div class="user-info flex justify-between items-center">
      <div class="flex gap-2 items-center">
        <img
          class="h-[35px] w-[35px] rounded-full object-cover object-top ring-[1px] p-[1px] ring-gray-100"
          :src="item.avartar || $avatar"
          @error="$handleProfileError"
          alt=""
        />
        <span class="text-sm  flex flex-col">
          <router-link :to="`/user/profile/${item.user}`" class="font-semibold dark:text-white text-black3">
            {{ `${item.userName}` }}
          </router-link>
          <span class="text-[8px] block leading-tight dark:text-gray-300 text-black3">{{ $formatRelativeTime(item.createdAt) }}</span>
           <!-- <span>{{ item.createdAt }}</span> -->
        </span>
      </div>

      <!-- v-if="user && user._id == item.user" -->

      <button class="brand-btn-md py-[4px] px-2 brand-outline dark:text-white text-black1" v-if="user && user._id !== item.user" @click="followAction(item)">
        {{ checkFollowing(item) ? 'Unfollow' : 'Follow' }}
      </button>
      <button v-else class="dark:text-white flex">
        <i-icon icon='nrk:more' class="text-[22px]"/>
      </button>
    </div>
    <!-- <p class="mt-2 text-sm">{{ item.description }}</p> -->
  </div>
</template>

<script>
export default {
  props: {
    reelData: {}
  },
  data() {
    return {
      item: {}
    }
  },

  methods: {
    checkFollowing(e) {
      if (!this.isLoggedIn) {
        return
      }
      let following = this.user.following
      let isFollowing = following.find((item) => item == e.user)
      return isFollowing
    },

    getUser() {
      this.$auth.getUser(this.user._id).then((res) => {
        this.$store.commit('auth/setUser', res.user)
        return res
      })
    },

    followAction(e) {
      let payload = {
        targetUserId: e.user, //like, unlike, favorite, unfavorite, follow, unfollow
        action: this.checkFollowing(e) ? 'unfollow' : 'follow'
      }
      this.$userActivity.toggleUserActions(payload).then(() => {
        this.getUser()
      })
    }
  },

  watch: {
    reelData: {
      handler(val) {
        this.item = val
      },
      immediate: true
    }
  },

  mounted() {
    // this.getUser()
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

<style></style>
