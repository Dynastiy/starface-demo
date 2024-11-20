<template>
  <div>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4 mt-4">
          <div v-for="item in 3" :key="item">
            <el-skeleton-item variant="image" style="height: 150px; border-radius: 10px" />
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <div class="flex lg:flex-row md:flex-row flex-col gap-4">
            <div
              v-for="(item, i) in fees"
              :key="i"
              class="p-4 border rounded-md w-full flex flex-col bg-white gap-1 justify-between"
              :class="[
                isActiveItem === changeTitle(item.subscription_name)
                  ? 'border-primary'
                  : 'border-gray-200'
              ]"
              @click="selectFees(item)"
            >
              <div class="flex justify-between">
                <span>
                  <h5 class="text-sm font-semibold">{{ item.subscription_name }}</h5>
                  <span class="text-xs block text-gray-400">{{
                    item.discount_applied_message
                  }}</span>
                </span>
                <span
                  class="text-sm font-medium text-gray-400"
                  v-if="item.discount_applied !== 0"
                  >{{ `${item.discount_applied}% OFF` }}</span
                >
              </div>
              <div>
                <h2 class="font-semibold text-xl">
                  {{ `${item.price_usdt}`
                  }}<span class="text-sm text-gray-400 font-medium"> USDT</span>
                </h2>
                <h2 class="font-semibold text-xl">
                  {{ `${item.price_chambs}`
                  }}<span class="text-sm text-gray-400 font-medium"> Chambs</span>
                </h2>
              </div>
              <h6></h6>
              <button
                class="brand-btn-md w-full"
                :class="[
                  isActiveItem === changeTitle(item.subscription_name)
                    ? 'brand-primary'
                    : 'bg-gray-300 text-gray-500'
                ]"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fees: [],
      isActiveItem: null,
      loading: false
    }
  },

  methods: {
    selectFees(e) {
      this.isActiveItem = this.isActiveItem && this.isActiveItem ===  this.changeTitle(e.subscription_name) ? null : this.changeTitle(e.subscription_name)
      const data_to_emit = this.isActiveItem ? e : null
      this.$emit('selectedFees', data_to_emit)
    },

    changeTitle(value) {
      let req = value.split(' ').join('_').toLowerCase()
      return req
    },

    getSubscriptions() {
      this.loading = true
      let user_id = this.user.user_id
      this.$appDomain
        .listSubscriptionFees(user_id)
        .then((res) => {
          this.fees = res.data
        })
        .finally(() => {
          this.loading = false
        })
    }
  },

  beforeMount() {
    this.getSubscriptions()
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    }
  }
}
</script>

<style></style>
