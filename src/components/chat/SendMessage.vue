<template>
  <div class="bg-white p-4 shadow-sm">
    <div class="flex gap-2 items-center">
      <pxTextarea
        class="p-2 w-full border border-primary"
        v-model="content"
        autoResize
        rows="1"
        cols="30"
      />
      <button class="brand-primary p-3 shadow rounded-full" @click="sendMessage">
        <i-icon icon="fluent:send-16-filled" class="text-lg text-white" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      respondentID: this.$route.query.uid,
      chatID: this.$route.params.id
    }
  },

  methods: {
    sendMessage() {
      let payload = {
        conversationId: this.chatID,
        sender: this.userID,
        receiver: this.respondentID,
        text: this.content
      }
      this.$chat.send(payload).then((res) => {
        console.log(res)
        this.content = ''
        this.$refresh('refresh')
      })
    }
  },

  computed: {
    userID(){
        return this.$store.getters['auth/getUserID']
    }
  }
}
</script>

<style></style>
