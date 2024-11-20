<template>
  <div class="wallet-data w-fit p-2">
    <span class="flex gap-3 items-center font-medium p-1 rounded-md">
      <span class="flex items-center">
        <!-- <i-icon icon="mdi:view-arrow-left" class="text-white" /> -->
         <img src="@/assets/img/icons/blue-starface.png" class="w-8" alt="">
        <span class="text-[14px] text-white font-medium">10</span>
      </span>

      <span>
        <router-link to="/wallet" class="flex items-center">
          <!-- <i-icon icon="fluent-emoji-flat:coin" /> -->
           <img src="@/assets/img/icons/yellow-starface.png" class="w-8" />
          <span class="text-[14px] text-white font-medium">$10</span>
        </router-link>
      </span>

      <!-- <span class="text-[13px] font-medium">(~10.5 USDT)</span> -->
    </span>
  </div>
</template>

<script>
export default {}
</script>

<style>
.wallet-data {
  position: absolute;
  top: 10px;
  /* right: 10px; */
  z-index: 999999;
}
</style>
