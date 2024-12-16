<template>
  <div class="p-4 pb-[80px]">
    <!-- {{notifications}} -->
    <div class="flex flex-col gap-2">
      <div
        v-for="item in notifications"
        :key="item.id"
        :class="[
          item.isRead ? 'bg-gray-200' : 'bg-white',
          'flex gap-2 items-center p-3 rounded-lg'
        ]"
        role="button"
        @click="readNotification(item)"
      >
        <span
          :class="['text-white p-2 rounded-full w-fit', item.isRead ? 'bg-gray-600' : 'bg-primary']"
        >
          <i-icon :icon="item.isRead ? 'tabler:message' : 'tabler:message-up'" class="text-2xl" />
        </span>
        <div class="flex flex-col">
          <span class="text-sm capitalize">
            {{ item.type }} received from <b>{{ item.senderName || 'user' }}</b></span
          >
          <span class="text-[11px] text-gray-400">
            {{ $formatRelativeTime(item.createdAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import socket from '@/plugins/socket'
export default {
  data() {
    return {
      notifications: [],
      // userId: '6748a795e5e9be0258b31bd9'
    }
  },

  methods: {
    async fetchAllNotifications() {
      // Emit event to fetch all notifications for the conversation
      //   console.log('Fetching notifications for user ID:', this.user._id)
        try {
          let res = await this.$userActivity.getNotifications()
          this.notifications = res
          this.unreadNotifications = res.filter((item) => !item.isRead)
        } catch (error) {
          return error
        }
      let userId = this.user._id
      socket.emit('getAllNotifications', { userId })

      console.log('Fetching all notifications...')

      socket.on('allNotifications', (data) => {
        // notifications.value = data.notifications
        console.log('All notifications received:', data)
      })
      // Emit the event to fetch all messages
    },

    async readNotification(item) {
      console.log(item)
      try {
        let res = await this.$userActivity.readNotification(item._id)
        this.$router.push(`/chat/message/${item.conversationId}?uid=${item.sender}`)
        return res
      } catch (error) {
        return error
      }
    }
  },

  created() {
    this.fetchAllNotifications()

    socket.on('newNotification', (notification) => {
      console.log('Notification received:', notification)
      // console.log(message)
      this.notifications.unshift(notification)
      // this.$nextTick(this.scrollToEnd)
    })

    console.log('Socket connected:', socket.connected)

    //  socket.on('newNotification', (data) => {
    //   console.log('Notifications received:', data)
    // })
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
