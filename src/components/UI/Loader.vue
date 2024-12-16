<template>
    <div class="fixed w-full bg-[rgba(0,0,0,0.6)] h-screen top-0 left-0 z-30 flex items-center justify-center">
      <div class="">
      <div class="flex flex-col items-center">
        <i-icon icon="line-md:loading-twotone-loop" class="text-[80px] text-primary" />
        <div>
          <span class="font-sm font-medium text-white">
          {{ loaderText }}
        </span>
        <span class="text-white font-bold">
          <!-- 10%  -->
          <slot name="counter"></slot>
        </span>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      loaderText: {
        type: String,
        default: 'Loading...'
      }
    }
  }
  </script>
  
  <style></style>
  