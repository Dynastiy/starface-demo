<template>
  <div class="wallet-data w-fit">
    <!-- {{user}} -->
    <span class="flex gap-3 items-center font-medium p-1 rounded-md">
      <!-- {{ starBalance }} -->
      <router-link to="/wallet" class="flex items-center">
        <img src="@/assets/img/icons/blue-starface.webp" class="w-7" alt="" />
        <span class="text-[12px] dark:text-white font-semibold whitespace-nowrap" v-if="starBalance !== null">{{ !isLoggedIn ? 0 : user.demo ? starBalance.demoStarBalance : starBalance.balance }}</span>
      </router-link>

      <router-link to="/wallet" class="flex items-center">
        <img src="@/assets/img/icons/yellow-starface.webp" class="w-7" />
        <span class="text-[12px] dark:text-white whitespace-nowrap font-semibold" v-if="user && starBalance !== null">{{
          $convertToDollar(user.demo ? starBalance.demoStarBalance : starBalance.balance)
         }}</span>
         <span v-else class="text-[12px] dark:text-white font-semibold">{{
          $convertToDollar(0)
         }}</span>
      </router-link>

      <!-- <router-link to="/wallet" class="flex items-center gap-1">
        <span class="text-white">DEMO:</span>
        <span class="text-[14px] text-white font-medium">{{ balance.demoStarBalance || 0 }}</span>
      </router-link> -->
    </span>
  </div>
</template>

<script>
export default {
  props: {
    // starBalance: Object
  },
  data() {
    return {
      // balance: {}
    }
  },

  watch: {
    // starBalance: {
    //   handler(val) {
    //     this.balance = val
    //   },
    //   immediate: true
    // }
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },

    isLoggedIn() {
      return this.$store.getters['auth/getAuthenticated']
    },

    starBalance() {
      return this.$store.getters['drawer/getStarBalance']
    }
  }
}
</script>

<style>
</style>
