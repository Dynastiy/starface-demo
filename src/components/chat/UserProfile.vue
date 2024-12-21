<template>
  <div class="px-4 flex justify-center py-4">
    <div class="flex flex-col gap-2 items-center">
      <img
        class="h-[65px] w-[65px] rounded-full object-cover object-top ring ring-primary"
        :src="info.profilePicture ? info.profilePicture : $avatar"
        @error="$handleProfileError"
        alt=""
      />
      <div class="text-center flex flex-col items-center">
        <h4 class="capitalize dark:text-white font-semibold leading-tight text-md">
          {{ `${info.firstName} ${info.lastName}` }}
        </h4>
        <h6 class="capitalize dark:text-gray-300 text-gray-500 text-xs">
          {{ `@${info.userName}` }}
        </h6>
        <router-link :to="`/user/profile/${info._id}`"
          ><button class="dark:bg-black3 dark:text-gray-200 bg-gray-200 text-[14px] px-2 mt-2 w-fit rounded-md font-medium py-1">
            View Profile
          </button>
        </router-link>
      </div>
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
