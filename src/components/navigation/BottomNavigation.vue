<template>
  <div
    class="fixed w-full rounded-tr-[15px] bottom-nav px-6 py-4 h-[60px] rounded-tl-[15px] bottom-0"
  >
    <div class="flex justify-between h-full w-full items-center container">
      <ul class="flex items-center w-full justify-between h-full mb-0">
        <li
          class=""
          :class="[routeParent === item.parent ? 'text-primary activeNav' : '']"
          v-for="(item, idx) in menu"
          :key="idx"
        >
          <span
            class="flex flex-col items-center gap-1 w-full text-sm font-semibold"
            @click="routeClick(item)"
          >
            <span>
              <i-icon :icon="item.icon" class="text-xl" />
            </span>
            <span class="font-medium text-[12px] capitalize">
              {{ item.title }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    routeClick(item) {
      console.log(item)
      this.$emit('routeClick', item)
    }
  },

  computed: {
    routeName() {
      return this.$route.meta.name
    },
    routeParent() {
      return this.$route.meta.parent
    }
  }
}
</script>

<style scoped>
.bottom-nav {
  /* backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  background-color: rgba(255, 255, 255, 0.5); */
  background-color: white;
  z-index: 1000;
  /* border-radius: 12px; */
  /* border: 1px solid rgba(255, 255, 255, 0.125); */
}
</style>
