<template>
  <div class="">
    <Loader v-if="loading" />
    <div v-else>
      <div class="">
        <slot />
      </div>
      <bottom-navigation class="" :menu="menu" />
    </div>
  </div>
</template>

<script>
// import AppHeader from '@/components/navigation/headers/AppHeader.vue'
import BottomNavigation from '@/components/navigation/BottomNavigation.vue'
// import WalletData from '@/components/utils/walletData.vue'
export default {
  components: { BottomNavigation },
  name: 'DashboardLayout',

  data() {
    return {
      loading: false,
      menu: [
        {
          parent: 'feeds',
          icon: 'fluent-mdl2:photo-video-media',
          title: 'feeds',
          url: '/'
        },
        {
          parent: 'connect',
          icon: 'fluent:people-community-24-filled',
          title: 'connect',
          url: '/connect'
        },
        {
          parent: 'create',
          icon: 'bxs:plus-circle',
          title: 'create',
          url: '/create'
        },
        {
          parent: 'chat',
          icon: 'raphael:chat',
          title: 'chat',
          url: '/chat'
        },

        {
          parent: 'profile',
          icon: 'mingcute:user-3-fill',
          title: 'profile',
          url: '/profile'
        }
      ],
      
    }
  },

  methods: {
    
  },
  mounted() {
    
  },


  created() {},

  computed: {
    routeName() {
      return this.$route.meta.name
    },

    routeParent() {
      return this.$route.meta.header
    },

    user() {
      return this.$store.getters['auth/getUser']
    },

    userMeta() {
      return this.$store.getters['auth/getUserMeta']
    },

    isSubPage() {
      return this.$route.meta.isSubPage
    },

    subRouteName() {
      return this.$route.meta.subName
    }
  }
}
</script>

<style></style>
