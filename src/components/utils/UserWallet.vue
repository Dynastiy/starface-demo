<template>
  <div>
    <div class="p-4">
      <el-skeleton style="width: 100%" :loading="loading" animated>
        <template #template>
          <div class="flex lg:flex-row md:flex-row flex-col w-full gap-4">
            <div v-for="item in 2" :key="item" class="w-full">
              <el-skeleton-item
                variant="image"
                style="height: 120px; border-radius: 10px; width: 100%"
              />
            </div>
          </div>
        </template>
        <template #default>
          <div class="flex lg:flex-row md:flex-row flex-col w-full gap-4">
            <!-- <div
              class="flex items-center bg-secondary text-white px-4 py-8 rounded-lg justify-between lg:pt-4 lg:pt-4 w-full"
              v-for="(item, i) in balances"
              :key="i"
              role="button"
            > -->
            <div
              class="flex items-center bg-secondary text-white px-4 py-8 rounded-lg justify-between lg:pt-4 lg:pt-4 w-full"
              role="button"
            >
              <div>
                <span class="flex items-center gap-1">
                  <span class="block text-[12px] text-gray-200 font-medium"
                    >Total Starface Balance:</span
                  >
                  <!-- <span class="password-iccon" role="button" @click="revealAmount(item)">
                    <i-icon
                      :icon="showAmount  ? 'tabler:eye' : 'gridicons:not-visible'"
                      class="form-icon"
                    />
                  </span> -->
                </span>
                <h1 class="text-4xl font-bold flex items-end gap-[2px]">
                  {{ `30,000` }}
                  <span class="text-lg">{{ 'starface' }}</span>
                </h1>
              </div>
              <!-- <img src="@/assets/img/wallet.svg" class="w-24" alt="" /> -->
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasActions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      showAmount: null,
      balances: [],
      selected: null
    }
  },
  methods: {
    getWallets() {
      this.loading = true
      let payload = {
        wallet_id: 'usdt,chambs',
        formatted: 'yes',
        user_id: this.user.user_id
      }
      this.$appDomain
        .getWallets(payload)
        .then((res) => {
          console.log(res)
          this.balances = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },

    selectWallet(item){
      this.selected = this.selected && this.selected === item.wallet_id ? null : item.wallet_id
      const data_to_emit = this.selected ? item : null
      this.$emit('walletSelected', data_to_emit)
    },

    revealAmount(item) {
      this.showAmount = !this.showAmount
        ? item.wallet_id
        : this.showAmount !== item.wallet_id
          ? item.wallet_id
          : null
    },

    triggerDeposit() {
      let payload = {
        user_id: this.user.user_id
      }
      this.$middleware.dashboardRefresh(payload)
    },

    hideBalance(value) {
      let number_of_times = `${value.wallet_balance_raw} ${value.wallet_symbol}`
      let req = []
      for (let i = 0; i < number_of_times; i++) {
        req.push('*')
      }
      let completed = req.join('')
      return completed
    }
  },

  beforeMount() {
    // this.getWallets()
    // this.triggerDeposit()
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    }
    // balance() {
    //   return Number(this.wallet.tradingBalance).toLocaleString('en-US', {
    //     style: 'currency',
    //     currency: 'NGN'
    //   })
    // },
    // hidden() {
    //   let nummber_of_times = this.balance.length
    //   let value = []
    //   for (let i = 0; i < nummber_of_times; i++) {
    //     value.push('*')
    //   }
    //   let completed = value.join('')
    //   return completed
    // }
  }
}
</script>

<style scoped>
.wallet {
  /* background: var(---secondary-color);
  color: var(---white); */
}
</style>
