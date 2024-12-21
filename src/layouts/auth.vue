<template>
  <div class="lg:p-4  auth md:p-4 dark:bg-black2 bg-white flex overflow-y-auto justify-center items-center h-[100dvh]">
    <div class=" lg:w-5/12 md:w-6/12 w-full ">
      <div class="py-8 px-8">
        <slot />
      </div>
     
    </div>
  </div>
</template>

<script>
export default {
  computed:{
    routeName(){
      return this.$route.name
    }
  }
}
</script>

<style>
</style>
