<template>
  <div class="py-2 px-4 bg-white z-10 rounded-bl-3xl rounded-br-3xl">
    <div class="flex justify-between items-center">
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
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i-icon icon="ion:notifcations" class="" width="20px" />
          </span>
          <template #dropdown>
            <el-dropdown-menu class="p-3 w-[200px]">
              <span v-for="(item, idx) in notifications" :key="idx">Pending Request from {{item}}</span>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
      notifications: []
    }
  },

  methods: {
    async getNotification() {
      // Emit event to fetch all messages for the conversation
      console.log('Fetching notifications for user ID:', this.user.id)
      try {
        let res = await this.$userActivity.getNotifications()
        console.log(res)
        this.notifications = res
      } catch (error) {
          return error
      }
      
      // Emit the event to fetch all messages
      socket.emit('getAllNotifications', { userId: this.user.id })
    }
  },

  mounted() {
    this.getNotification()
    // Listen for messages when component mounts
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
