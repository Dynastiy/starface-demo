<template>
  <div class="p-4 flex flex-col gap-4">
    <span
      class="p-3 text-[13px] lg:w-6/12 md:w-7/12 w-6/12 block"
      :class="[
        item.sender === this.userID
          ? 'ml-auto lg:bg-gray-100 md:bg-gray-100 bg-gray-200 rounded-tr-[15px] rounded-bl-[15px] rounded-br-[15px]'
          : 'rounded-tr-[15px] rounded-tl-[15px] rounded- rounded-bl-[15px] bg-white'
      ]"
      v-for="(item, idx) in messages"
      :key="idx"
    >
      <!-- {{  }} -->
      <span v-html="item.text"></span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ID: this.$route.params.id,
      messages: []
    }
  },

  methods: {
    getConversation() {
      this.$chat.conversation(this.ID).then((res) => {
        console.log(res)
        this.messages = res
      })
    }
  },

  beforeMount() {
    this.getConversation()
  },

  computed: {
    userID() {
      return this.$store.getters['auth/getUserID']
    }
  }
}
</script>

<style></style>
