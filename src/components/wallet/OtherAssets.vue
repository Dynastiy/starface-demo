<template>
    <div class="">
        <div
          class="flex lg:flex-row md:flex-row flex-col justify-between lg:items-end md:items-end gap-4"
        >
          <div>
            <div class="flex flex-col gap-2 gap-3 w-full">
              <div
                class=" w-full p-6 rounded-lg flex justify-between dark:bg-black3 bg-gray-200"
                v-for="(value, name) in walletData.otherBalances"
                :key="name"
              >
                <span class="text-[14px] dark:text-gray-300 text-black2 font-medium capitalize">{{
                  name.split('_').join(' ')
                }}</span>
                <span class="font-bold text-[14px] dark:text-white text-black2">{{ value }}</span>
              </div>
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
        default: () => ({}) // Prevents errors if walletData is undefined or null
      }
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
          { label: 'purchase', icon: 'mingcute:transfer-line' },
          { label: 'staking', icon: 'streamline:investment-selection-solid' }
        ],
        localLoading: true
      }
    },
    methods: {
      openSendFunds(item) {
        this.$emit('actionClick', item)
      },
  
      isDemoAccount(item) {
        let isDemo = this.user.demo && item.label == 'withdraw'
        return isDemo
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
  