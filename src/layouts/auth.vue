<template>
  <div class="lg:p-4 lg:bg-gray-100 md:bg-gray-100 auth md:p-4 bg-white flex overflow-y-auto justify-center items-center min-h-screen">
    <div class="bg-white lg:w-5/12 md:w-6/12 w-full ">
      <div class="md:flex lg:flex hidden w-full" v-if="routeName === 'login' || routeName === 'register' ">
        <router-link to="/login" class="w-full border text-center py-3 font-medium text-[14px]" >Login</router-link>
        <router-link to="/register" class="w-full border text-center py-3 font-medium text-[14px]">Register</router-link>
      </div>
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
