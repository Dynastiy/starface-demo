<template>
  <div class="p-4 flex flex-col pb-[80px] gap-4">
    <div>
      <h4 class="font-semibold">Chat Request</h4>
      <div class="flex gap-3 overflow-y-scroll">
        <div
          v-for="item in unreadMessages"
          :key="item"
          class="flex flex-col overflow-x-scroll items-center"
        >
          <span @click="readMessage(item)" role="button" class="w-fit relative">
            <img
              class="h-[42px] w-[42px] rounded-full"
              :src="getOtherUser(item).profilePicture"
              @error="$handleProfileError"
              alt=""
            />
            <span class="text-xs text-gray-500 capitalize">{{ getOtherUser(item).userName }}</span>
          </span>
        </div>
      </div>
    </div>

    <div>
      <h4 class="font-semibold">Messages</h4>
      <div class="flex flex-col gap-4 mt-2">
        <div class="bg-white p-2 rounded-md" v-for="item in messages" :key="item">
          <router-link
            :to="`/chat/message/${item._id}?uid=${getOtherUser(item)._id}`"
            class="flex justify-between"
          >
            <span class="flex gap-2 items-center">
              <img
                class="h-[42px] w-[42px] rounded-full"
                :src="getOtherUser(item).profilePicture"
                @error="$handleProfileError"
                alt=""
              />
              <span>
                <h5 class="font-semibold text-md capitalize">{{ getOtherUser(item).userName }}</h5>
                <h6 class="text-xs">
                  {{ (item.lastMessage.sender == userID ? 'You: ' : '') + item.lastMessage.text }}
                </h6>
              </span>
            </span>
            <span class="text-xs text-gray-400 capitalize">
              {{ $formatRelativeTime(item.lastMessage.createdAt) }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      unreadMessages: []
    }
  },

  methods: {
    getConversations() {
      this.$chat.conversations().then((res) => {
        this.unreadMessages = res.filter((item) => item.readStatus == 'unread')
        this.messages = res.filter((item) => item.readStatus !== 'unread')
      })
    },

    readMessage(item) {
      let payload = {
        userId: this.userID
      }
      this.$chat.readChat(payload, item._id).then(() => {
        this.$router.push(`/chat/message/${item._id}?uid=${this.getOtherUser(item)._id}`)
      })
    },

    getOtherUser(e) {
      let participants = e.participants
      let user = participants.find((user) => user._id !== this.userID)
      return user
    }
  },

  beforeMount() {
    this.getConversations()
  },

  mounted() {
    this.intervalId = setInterval(this.getConversations, 10000)
  },

  beforeUnmount() {
    clearInterval(this.intervalId)
  },

  computed: {
    userID() {
      return this.$store.getters['auth/getUserID']
    }
  }
}
</script>

<style></style>
