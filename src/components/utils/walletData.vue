<template>
  <div class="wallet-data w-fit p-2">
    <span class="flex gap-3 items-center font-medium p-1 rounded-md">
      <router-link to="/wallet" class="flex items-center">
        <img src="@/assets/img/icons/blue-starface.png" class="w-8" alt="" />
        <span class="text-[14px] text-white font-medium">{{ balance }}</span>
      </router-link>

      <router-link to="/wallet" class="flex items-center">
        <img src="@/assets/img/icons/yellow-starface.png" class="w-8" />
        <span class="text-[14px] text-white font-medium">{{ $convertToDollar(balance) }}</span>
      </router-link>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    starBalance: Number
  },
  data() {
    return {
      balance: 0
    }
  },
  watch: {
    starBalance: {
      handler(val) {
        this.balance = val
      },
      immediate: true
    }
  }
}
</script>

<style>
.wallet-data {
  position: absolute;
  top: 10px;
  /* right: 10px; */
  z-index: 99;
}
</style>
