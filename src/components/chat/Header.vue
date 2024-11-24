<template>
  <div class="bg-white px-4 h-[50px] flex gap-2 items-center shadow-sm">
    <span role="button" @click="$router.go(-1)">
      <i-icon icon="ic:baseline-arrow-back" class="text-2xl font-semibold" />
    </span>
    <div class="flex gap-2 items-center">
      <img
        class="h-[35px] w-[35px] rounded-full object-cover object-top ring ring-[#fff]"
        :src="info.profilePicture ? info.profilePicture : $avatar"
        @error="$handleProfileError"
        alt=""
      />
      <h4 class="capitalize font-semibold">{{ info.userName }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userID: this.$route.query.uid,
      info: {}
    }
  },

  methods: {
    getUser() {
      this.$auth.getUser(this.userID).then((res) => {
        console.log(res)
        this.info = res.user
      })
    }
  },

  beforeMount() {
    this.getUser()
  }
}
</script>

<style></style>
