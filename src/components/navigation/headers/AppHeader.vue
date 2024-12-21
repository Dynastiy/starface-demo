<template>
  <div class="py-4 px-2 z-10 dark:bg-black2 bg-gray-100 sticky top-0">
    <div class="flex justify-between items-center">
      <div class="flex gap-2 items-center justify-between" v-if="routeName !== 'feeds'">
        <span @click="$router.go(-1)" role="button" class="">
          <i-icon icon="charm:arrow-left" class="text-lg dark:text-gray-100 text-black3" />
        </span>
        <div class="flex justify-center w-full">
          <h3 class="font-semibold text-lg capitalize dark:text-gray-100 text-black3">
            {{ routeName.split('-').join(' ') }}
          </h3>
        </div>
      </div>
      <img v-else src="@/assets/img/icons/coin_claim.webp" class="w-12" alt="" />
      <div class="flex gap-3 items-center">
        <div>
          <wallet-data />
        </div>
        <router-link to="/notifications" class="relative">
          <i-icon
            icon="tabler:message-filled"
            class="dark:text-gray-100 text-black3"
            width="25px"
          />
          <span
            class="absolute block bg-red-600 top-0 right-0 text-white font-medium w-3 h-3 ring ring-[2px] ring-white rounded-full p-[3px] text-[10px] flex items-center justify-center"
          >
            {{ unreadNotifications.length }}
          </span>
        </router-link>
        <button @click="toggleTheme">
          <i-icon
            :icon="theme == 'dark' ? 'solar:sun-bold' : 'bxs:moon'"
            class="dark:text-amber-300 text-black3"
            width="27px"
          />
        </button>
        <!-- <img
          v-if="user"
          :src="user.profilePicture ? user.profilePicture : image"
          class="w-[40px] h-[40px] border-2 p-[2px] border-gray-300 rounded-full object-fit object-top"
          role="button"
          @click="$router.push('/profile')"
          @error="$handleProfileError"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import image from '@/assets/img/no-user.png'
import socket from '@/plugins/socket'
import WalletData from '@/components/utils/walletData.vue'
export default {
  components: { WalletData },
  data() {
    return {
      image,
      notifications: [],
      unreadNotifications: []
    }
  },

  methods: {
    async getNotification() {
      // Emit event to fetch all notifications for the conversation
      // console.log('Fetching notifications for user ID:', this.user.id)
      try {
        let res = await this.$userActivity.getNotifications()
        this.notifications = res
        this.unreadNotifications = res.filter((item) => !item.isRead)
      } catch (error) {
        return error
      }
      // Emit the event to fetch all messages
      let data = { userId: this.user._id }
      socket.emit('getAllNotifications', data)
    },

    getEarnWallet() {
      if (!this.isLoggedIn) {
        return
      }
      this.$wallet.earnWallet().then((res) => {
        let starBalance = res.star
        console.log(res)
        this.$store.commit('drawer/setStarBalance', starBalance)
      })
    },

    toggleTheme() {
      // Toggle between light and dark themes
      let theme = this.theme === 'dark' ? 'light' : 'dark'
      this.$store.commit('setTheme', theme)
      document.documentElement.className = theme // Apply theme to <html>
    }
  },

  mounted() {
    // Listen for messages when component mounts
    socket.on('newNotification', (notification) => {
      console.log('Notification received:', notification)
      this.unreadNotifications.unshift(notification)
    })

    socket.on('allNotifications', (data) => {
      console.log('Notifications received:', data)
    })

    this.getNotification()
    
  },

  beforeMount(){
    this.getEarnWallet()
  },

  watch: {
    // user_id: {
    //   handler(oldVal, newVal) {
    //     if (oldVal !== newVal) {
    //       this.getUser()
    //     }
    //   }
    // }
  },

  beforeUnmount() {
    // socket.off('newNotification')
    // socket.off('allNotifications')
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },
    userMeta() {
      return this.$store.getters['auth/getUserMeta']
    },
    routeName() {
      return this.$route.meta.name
    },
    theme() {
      return this.$store.getters['getTheme']
    },
    
  }
}
</script>

<style></style>
