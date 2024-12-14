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
import image from '@/assets/img/no-user.png'
import socket from '@/plugins/socket'
export default {
  data() {
    return {
      image,
      notifications: []
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
      // socket.emit('getAllNotifications', { userId: this.user.id })
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

  mounted() {
    this.getNotification()
    // Listen for messages when component mounts

    socket.on('newNotification', (notification) => {
      console.log('Notification received:', notification)
      // console.log(message)
      this.unreadNotifications.unshift(notification)
      // this.$nextTick(this.scrollToEnd)
    })
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
