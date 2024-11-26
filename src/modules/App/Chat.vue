<template>
  <div class="p-4 pb-[80px]">
    <div class="flex flex-col gap-4">
      <!-- <div class="input-field bg-white">
        <span class="w-full flex gap-2 items-center">
          <span class="password-iccon">
            <i-icon icon="fluent:search-32-filled" class="form-icon" />
          </span>
          <input
            type="text"
            name="search"
            class="w-full"
            id="password"
            placeholder="Search Users and start a conversation"
          />
        </span>
      </div> -->
      <!-- <v-select @search="fetchOptions" /> -->
      <vSelect
        :options="items"
        :reduce="(opt) => opt._id"
        @search="fetchOptions"
        label="userName"
        @option:selected="setSelected"
        placeholder="Search Users and start a conversation"
      >
        <template #open-indicator="{ attributes }">
          <span v-bind="attributes"
            ><i-icon icon="radix-icons:caret-down" color="#4F4F4F" width="20px"
          /></span>
        </template>
      </vSelect>
      <div>
        <h4 class="font-semibold">Message Requests <span class="text-xs font-semibold text-primary">{{ `(${unreadMessages.length})` }}</span></h4>
        <div class="flex gap-3 overflow-x-scroll mt-3">
          <div v-if="unreadMessages.length == 0" class="flex flex-col w-full gap-1 items-center">
            <i-icon icon="lucide:messages-square" class="text-4xl" />
            <span class="text-xl font-semibold">No Pending Message Requests!</span>
          </div>
          <div v-for="item in unreadMessages" :key="item" class="flex flex-col items-center w-full">
            <span
              @click="item.sender.senderId !== userID ? updateStatus(item) : ''"
              role="button"
              class="w-fit relative flex items-center flex-col gap-1"
            >
              <img
                class="h-[42px] w-[42px] rounded-full"
                :src="item.user.profilePicture || $avatar"
                @error="$handleProfileError"
                alt=""
              />
              <span class="text-[10px] block leading-tight text-gray-500 capitalize text-center">{{ item.user.userName || "Starface User" }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-4" />
    <div class="">
      <h4 class="font-semibold">Messages</h4>
      <div class="flex flex-col gap-4 mt-2">
        <div class="bg-white p-2 rounded-md" v-for="item in messages" :key="item">
          <router-link
            :to="`/chat/message/${item._id}?uid=${item.user.receiverId}`"
            class="flex justify-between"
          >
            <span class="flex gap-2 items-center">
              <img
                class="h-[42px] w-[42px] rounded-full"
                :src="item.user.profilePicture || $avatar"
                @error="$handleProfileError"
                alt=""
              />
              <span>
                <h5 class="font-semibold text-md capitalize">{{ item.user.userName || "Starface User" }}</h5>
                <h6 class="text-xs" v-if="item.lastMessage">
                  {{ (item.lastMessage.sender == userID ? 'You: ' : '') + item.lastMessage.text }}
                </h6>
              </span>
            </span>
            <span v-if="item.lastMessage" class="text-xs text-gray-400 capitalize">
              {{ $formatRelativeTime(item.lastMessage.createdAt) }}
            </span>
          </router-link>
        </div>
        <div v-if="messages.length == 0" class="flex flex-col gap-1 items-center">
          <i-icon icon="lucide:messages-square" class="text-4xl" />
          <span class="text-xl font-semibold">No Messages yet!</span>
          <span class="text-sm">Search for a user and send your first message</span>
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
      unreadMessages: [],
      items: [],
      userName: '',
      loading: false
    }
  },

  methods: {
    getConversations() {
      this.loading = true
      this.$chat
        .conversations()
        .then((res) => {
          let messages = []
          res.forEach((item) => {
            let messageData = {
              ...item,
              user:
                item.sender == null
                  ? {}
                  : item.sender.senderId == this.userID
                    ? item.receiver
                    : item.sender
            }
            messages.push(messageData)
          })
          this.unreadMessages = messages.filter((item) => item.status == 'pending')
          this.messages = messages.filter((item) => item.status == 'accepted')
        })
        .finally(() => {
          this.loading = false
        })
    },

    async fetchOptions(search, loading) {
      console.log(search)
      let payload = {
        search: search
      }
      loading(true)
      try {
        const res = await this.$appImages.connect(payload)
        this.items = res.users
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        loading(false)
      }
    },

    setSelected(e) {
      console.log(e)
      let payload = {
        userId: this.userID,
        recipientId: e._id
      }
      this.$chat.startChat(payload).then(() => {
        // console.log(res)
        this.$toastify({
          text: 'Chat request sent, Pending approval.',
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          style: {
            fontSize: '13px',
            borderRadius: '4px',
            background: '#333'
          }
        }).showToast()
        return
        // this.$router.push(`chat/message/${res._id}?uid=${e._id}`)
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

    updateStatus(item) {
      let payload = {
        status: 'accepted'
      }
      this.$chat.updateStatus(payload, item._id).then(() => {
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
