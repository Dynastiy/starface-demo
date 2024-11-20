<template>
  <div>
    <div class="flex justify-between items-center">
      <span v-if="routeName === 'home'" class="brand-icon block text-2xl">Mango Meet</span>
      <div v-else class="flex gap-4 items-center justify-between">
        <span
          @click="$router.go(-1)"
          role="button"
          class="bg-gray200 border border-gray300 p-2 rounded-full"
        >
          <i-icon icon="charm:arrow-left" class="text-xl" />
        </span>
        <div class="flex justify-center w-full">
          <h3 class="font-bold text-2xl capitalize">{{ routeName.split('-').join(' ') }}</h3>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <!-- {{user}} -->
        <img
          v-if="userMeta"
          :src="userMeta.profile_picture_url ? userMeta.profile_picture_url : image"
          class="w-[45px] h-[45px] border-2 p-[2px] border-gray-300 rounded-full object-fit object-top"
          role="button"
          @click="$router.push('/profile')"
        />
        <!-- <div>
          <span class="text-sm capitalize font-semibold block">Vendor</span>
          <span class="text-xs block text-gray-400">{{
            `${user.first_name} ${user.last_name}`
          }}</span>
        </div> -->
        <button
          v-if="routeName === 'home'"
          class="brand-btn brand-primary rounded-full flex items-center gap-2 justify-center"
          @click="$router.push('/upgrade')"
        >
          <i-icon icon="icomoon-free:fire" />
          <!-- upgrade -->
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import image from '@/assets/img/no-user.png'
export default {
  data() {
    return {
      image
    }
  },

  watch: {
    // user_id: {
    //   handler(oldVal, newVal) {
    //     if (oldVal !== newVal) {
    //       this.getUser()
    //     }
    //   }
    // }
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },
    userMeta() {
      return this.$store.getters['auth/getUserMeta']
    },
    routeName() {
      return this.$route.meta.name
    }
  }
}
</script>

<style></style>
