<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- <div>
      <div class="flex gap-1 pl-2 items-center bg-white rounded-md">
        <i-icon icon="uil:search" />
        <input
          type="text"
          placeholder="Search Here"
          class="flex-1 p-2 outline-none placeholder:text-sm text-[13px]"
        />
      </div>
    </div> -->

    <div>
      <h4 class="font-semibold">Chats</h4>
      <div class="flex gap-3 overflow-y-scroll">
        <div v-for="item in messages" :key="item" class="flex flex-col items-center">
          <img
            class="h-[42px] w-[42px] rounded-full"
            :src="getOtherUser(item).profilePicture"
               @error="$handleProfileError"
            alt=""
          />
          <span class="text-xs text-gray-500">{{ getOtherUser(item).userName }}</span>
        </div>
      </div>
    </div>

    <div>
      <h4 class="font-semibold">Messages</h4>
      <div class="flex flex-col gap-4">
        <div
          class="bg-white p-2 rounded-md"
          v-for="item in messages"
          :key="item"
        >
          <router-link :to='`/chat/message/${item._id}?uid=${getOtherUser(item)._id}`' class="flex justify-between">
            <span class="flex gap-2 items-center">
            <img
              class="h-[42px] w-[42px] rounded-full"
              :src="getOtherUser(item).profilePicture"
               @error="$handleProfileError"
              alt=""
            />
            <span>
              <h5 class="font-semibold text-md">{{ getOtherUser(item).userName }}</h5>
              <h6 class="text-xs">{{ item.lastMessage.text }}</h6>
            </span>
          </span>
          <span class="text-xs text-gray-400 capitalize"> {{ $formatRelativeTime(item.lastMessage.createdAt) }} </span>
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
      messages: []
    }
  },

  methods: {
    getConversations() {
      this.$chat.conversations().then((res) => {
        console.log(res)
        this.messages = res
      })
    },

    getOtherUser(e) {
        let participants = e.participants
        let user = participants.find(user => user._id !== this.userID)
        console.log('otherUsre:', user)
        return user
    }
  },

  beforeMount() {
    this.getConversations()
  },

  computed: {
    userID(){
        return this.$store.getters['auth/getUserID']
    }
  }
}
</script>

<style></style>
