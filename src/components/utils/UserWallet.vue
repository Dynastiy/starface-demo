<template>
  <div class="p-4">
      <div>
        <div
          class="flex lg:flex-row md:flex-row flex-col justify-between lg:items-end md:items-end gap-4"
        >
          <div>
            <div class="flex flex-col mb-4">
              <span class="text-xs block text-primary leading-tightest font-semibold">
                Star Balance</span
              >
              <span class="font-bold text-4xl leading-tightest">{{ walletData.starBalance }}</span>
              <span class="text-sm text-gray-500 block leading-tightest font-semibold">{{ $convertToDollar(walletData.starBalance) }}</span>
            </div>

            <div class="flex flex-col gap-3 w-full">
              <div
                class="bg-secondary w-full p-3 rounded-md flex flex-col"
                v-for="(value, name) in walletData.otherBalances"
                :key="name"
              >
                <span class="text-[12px] text-gray-400 font-medium capitalize">{{
                  name.split('_').join(' ')
                }}</span>
                <span class="font-bold text-xl text-white">{{ value }}</span>
              </div>
            </div>
          </div>
          <div class="flex lg:w-fit md:w-fit w-full gap-2">
            <span
              role="button"
              class="border w-full whitespace-nowrap bg-gray-100 flex flex-col items-center gap-1 rounded-[5px] px-1 py-[5px] text-[11px] capitalize font-sembold"
              v-for="item in actions"
              :key="item.label"
              @click="openSendFunds(item)"
            >
              <i-icon
                :icon="item.icon"
                class="bg-primary text-white block text-primary rounded-full text-xl p-[2px]"
              />
              <span class="text-[9px]">{{ item.label.split('_').join(' ') }}</span></span
            >
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// import WalletData from './walletData.vue';

export default {
  props: {
    hasActions: Boolean,
    walletData: {
      type: Object,
      default: () => ({}), // Prevents errors if walletData is undefined or null
    },
  },

  data() {
    return {
      showAmount: null,
      balances: [],
      selected: null,
      actions: [
        { label: 'fund_wallet', icon: 'mingcute:send-fill' },
        { label: 'withdraw', icon: 'flowbite:download-solid' },
        { label: 'convert', icon: 'simple-icons:convertio' },
        { label: 'transfer', icon: 'mingcute:transfer-line' }
      ],
      localLoading: true
    }
  },
  methods: {
    openSendFunds(item) {
      this.$emit('actionClick', item)
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
  }
}
</script>

<style scoped></style>
