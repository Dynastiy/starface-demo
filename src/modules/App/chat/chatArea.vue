<template>
  <div class="h-[100vh] flex flex-col overflow-y-hidden">
    <chat-header />
    <div class="flex-1 overflow-y-auto h-full" ref="messagesContainer">
      <bubble :allMessages="messages" />
    </div>
    <send-message @refresh="refresh" />
  </div>
</template>

<script>
import chatHeader from '@/components/chat/Header.vue'
import Bubble from '@/components/chat/Bubble.vue'
import SendMessage from '@/components/chat/SendMessage.vue'
export default {
  components: { chatHeader, Bubble, SendMessage },
  data(){
    return {
      isRefreshing: false,
      ID: this.$route.params.id,
      messages: []
    }
  },

  methods: {
    getConversation() {
      this.$chat.conversation(this.ID).then((res) => {
        this.messages = res
        this.$nextTick(() => {
            this.scrollToEnd()
          })
      })
    },

    scrollToEnd() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    refresh(){
      this.getConversation()
    }
  },

  mounted() {
    this.intervalId = setInterval(this.getConversation, 10000)
  },

  beforeUnmount() {
    clearInterval(this.intervalId)
  },

  beforeMount(){
    this.getConversation()
  }
}
</script>

<style></style>
