<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-1 flex-col overflow-y-auto gap-3 mb-4">
      <h4 class="font-semibold">Comments</h4>
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
      <div v-for="comment in comments" :key="comment.id" class="flex gap-2">
        <img
          class="h-[30px] w-[30px] rounded-full ring ring-[#fff]"
          :src="comment.avartar"
          @error="$handleProfileError"
          alt=""
        />
        <span class="p-2 bg-gray-50 block w-full rounded-lg">
          <h6 class="text-xs font-semibold"><router-link :to="`/user/profile/${comment.user}`"> {{ comment.userName }} </router-link> </h6>
          <p class="text-xs">{{ comment.comment }}</p>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: null,
    reel: Object
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

    sendComment() {
      let payload = {
        userId: this.userID,
        comment: this.content
      }
      console.log(payload)
      this.$reels.comment(payload, this.reel._id).then((res) => {
        console.log(res)
        this.$emit('refresh')
        this.content = ''
      })
    }
  },

  beforeMount() {
    // this.fetchUser()
  },

  watch: {
    items: {
      handler(val) {
        this.comments = val
        // this.fetchUser()
      },
      immediate: true
    }
  },

  computed: {
    userID() {
      return this.$store.getters['auth/getUserID']
    }
  }
}
</script>

<style></style>
