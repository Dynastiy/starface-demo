<template>
  <div class="h-[100dvh] flex flex-col overflow-y-hidden">
    <chat-header :wallet="walletData" />
    <div
      class="flex-1 overflow-y-auto h-full"
      ref="messagesContainer"
      role="log"
      aria-live="polite"
      aria-atomic="true"
    >
      <user-profile />
      <bubble :allMessages="messages" />
    </div>
    <send-message @refresh="refresh" />
  </div>
</template>

<script>
import chatHeader from '@/components/chat/Header.vue'
import Bubble from '@/components/chat/Bubble.vue'
import SendMessage from '@/components/chat/SendMessage.vue'
import UserProfile from '@/components/chat/UserProfile.vue'
import socket from "@/plugins/socket";
export default {
  components: { chatHeader, Bubble, SendMessage, UserProfile },
  data() {
    return {
      isRefreshing: false,
      ID: this.$route.params.id,
      messages: [],
      walletData: null
    }
  },
  methods: {
    async getConversation() {
      // Emit event to fetch all messages for the conversation
      // console.log("Fetching messages for conversation ID:", this.ID);
      try {
        const res = await this.$chat.conversation(this.ID)
        this.messages = res
        this.$nextTick(this.scrollToEnd)
      } catch (err) {
        console.error('Failed to fetch conversation:', err)
      }
      // Emit the event to fetch all messages
      socket.emit("getAllMessages", { conversationId: this.ID });
    },

    scrollToEnd() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    refresh() {
      // this.getConversation()
      this.getEarnWallet()
    },

    getEarnWallet() {
      this.$wallet.earnWallet().then((res) => {
        // console.log(res)
        this.walletData = res
      })
    }
  },
  mounted() {
    // Listen for messages when component mounts
    socket.on("allMessages", (data) => {
      console.log("Messages received:", data);
      // if (data.conversationId === this.ID) {
      //   this.messages = data.messages;
      //   this.$nextTick(this.scrollToEnd);
      // }
    });


    socket.on("receiveMessage", (message) => {
      // console.log(message)
      this.messages.push(message);
      // this.$nextTick(this.scrollToEnd)
    });

    console.log("Socket connected:", socket.connected);

    this.getConversation()
    this.getEarnWallet()
  },

  beforeUnmount() {
    // clearInterval(this.intervalId)
    // Clean up socket listeners
    socket.off("allMessages");
    socket.off("receiveMessage");
  }
}
</script>

<style></style>
