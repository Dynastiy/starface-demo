<template>
  <div class="py-2 px-4 bg-white z-10 rounded-bl-3xl rounded-br-3xl">
    <div class="flex justify-between items-center">
      <!-- {{ user }} -->
      <!-- <span v-if="routeName === 'home'" class="brand-icon block text-2xl">

      </span> -->
      <div class="flex gap-2 items-center justify-between">
        <span
          @click="$router.go(-1)"
          role="button"
          class="bg-gray-200 border border-gray-300 p-[8px] rounded-full"
        >
          <i-icon icon="charm:arrow-left" class="text-lg" />
        </span>
        <div class="flex justify-center w-full">
          <h3 class="font-semibold text-lg capitalize">{{ routeName.split('-').join(' ') }}</h3>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <!-- <el-dropdown trigger="click" placement="bottom-end">
          <span class="el-dropdown-link relative">
            <i-icon icon="ion:notifcations" class="text-[#000]" width="25px" />
            <span class="absolute block bg-red-600 top-0 right-0 text-white font-medium w-3 h-3 ring ring-[2px] ring-white rounded-full text-[8px] flex items-center justify-center">
              {{unreadNotifications.length}}
            </span>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="p-3 w-[200px]">
              <template v-if="notifications.length">
                <div class="flex flex-col" v-for="(item, idx) in unreadNotifications" :key="idx">
                  <span> {{ item.type }} from {{ item.senderName || 'user' }}</span>
                  <span>{{ item.text }}</span>
                </div>
              </template>
              <template v-else>
                <div>No notifications</div>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <router-link to="/notifications" class="relative">
          <i-icon icon="ion:notifcations" class="text-[#000]" width="25px" />
          <span
            class="absolute block bg-red-600 top-0 right-0 text-white font-medium w-3 h-3 ring ring-[2px] ring-white rounded-full p-[3px] text-[10px] flex items-center justify-center"
          >
            {{ unreadNotifications.length }}
          </span>
        </router-link>
        <img
          v-if="user"
          :src="user.profilePicture ? user.profilePicture : image"
          class="w-[40px] h-[40px] border-2 p-[2px] border-gray-300 rounded-full object-fit object-top"
          role="button"
          @click="$router.push('/profile')"
          @error="$handleProfileError"
        />
      </div>
    </div>
  </div>
</template>

<script>
import image from '@/assets/img/no-user.png'
import socket from '@/plugins/socket'
export default {
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
      console.log('Fetching notifications for user ID:', this.user.id)
      try {
        let res = await this.$userActivity.getNotifications()
        this.notifications = res
        this.unreadNotifications = res.filter((item) => !item.isRead)
      } catch (error) {
        return error
      }
      // Emit the event to fetch all messages
      let userId = this.user._id
      socket.emit('getAllNotifications', { userId })
    }
  },

  mounted() {
    this.getNotification()
    // Listen for messages when component mounts

    socket.on('newNotification', (notification) => {
      console.log('Notification received:', notification)
      // console.log(message)
      this.unreadNotifications.unshift(notification)
      // this.$nextTick(this.scrollToEnd)
    })
    socket.on('allNotifications', (data) => {
      console.log('Notifications received:', data)
    })
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
    socket.off('newNotification')
    socket.off('allNotifications')
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
    }
  }
}
</script>

<style></style>
