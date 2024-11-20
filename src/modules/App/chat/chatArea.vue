<template>
  <div class="h-[100vh] flex flex-col overflow-y-hidden">
    <chat-header />
    <div class="flex-1 overflow-y-auto h-full">
      <bubble />
    </div>
    <send-message />
  </div>
</template>

<script>
import chatHeader from '@/components/chat/Header.vue'
import Bubble from '@/components/chat/Bubble.vue'
import SendMessage from '@/components/chat/SendMessage.vue'
export default {
  components: { chatHeader, Bubble, SendMessage }
}
</script>

<style></style>
