<template>
  <div class="flex flex-col h-full">
   <div class="flex flex-1  flex-col gap-3 mb-4">
    <div v-for="comment in comments" :key="comment.id" class="flex gap-2">
      <img
        v-if="Object.keys(user).length > 0"
        class="h-[35px] w-[35px] rounded-full ring ring-[#fff]"
        :src="user[comment.user].profilePicture"
        @error="$handleProfileError"
        alt=""
      />
      <span class="p-2 bg-gray-50 block w-full rounded-lg">
        <h6 class="text-xs">{{ comment.userName }}</h6>
        <p class="text-xs">{{ comment.comment }}</p>
      </span>
    </div>
   </div>

    <div>
      <div class="flex gap-2 items-center">
        <pxTextarea
          class="p-3 w-full border border-primary"
          v-model="content"
          autoResize
          rows="1"
          cols="30"
        />
        <button class="brand-primary p-3 shadow rounded-full" @click="sendComment">
          <i-icon icon="fluent:send-16-filled" class="text-lg text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: null,
  },

  data() {
    return {
      user: {},
      comments: [],
      content: ''
    }
  },

  methods: {
    async fetchUser() {
      // this.loading = true;
      // this.error = null;

      // Create an array of Axios requests
      const requests = this.items.map((item) => {
        console.log(item)
        return this.$auth
          .getUser(`${item.user}`)
          .then((response) => {
            console.log(response, 'testing')
            // this.$set(this.reviewers, item.user_id, response.user);
            this.user[item.user] = response.user
          })
          .catch((err) => {
            // this.error = 'An error occurred while fetching reviewer data.';
            console.log(err)
          })
      })

      // Wait for all requests to complete
      try {
        await Promise.all(requests)
      } catch (err) {
        this.error = 'An error occurred while fetching reviewer data.'
      } finally {
        this.loading = false
      }
    },
    sendComment() {}
  },

  beforeMount() {
    this.fetchUser()
  },

  watch: {
    items: {
      handler(val) {
        this.comments = val
        this.fetchUser()
      },
      immediate: true
    }
  }
}
</script>

<style></style>
