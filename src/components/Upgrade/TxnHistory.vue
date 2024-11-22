<template>
  <div class="p-4">
    <h4 class="font-semibold mb-2">Recent Transactions</h4>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="flex flex-col gap-4">
          <div v-for="item in 6" :key="item">
            <el-skeleton-item variant="image" style="height: 40px; border-radius: 10px" />
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, idx) in items"
              :key="idx"
              class="bg-white p-3 flex justify-between rounded-lg"
            >
              <div class="flex gap-2">
                <span
                  class="h-8 w-8 flex items-center justify-center font-weight-bold rounded"
                  :class="[item.transaction_type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100']"
                >
                  <i-icon
                    :icon="
                      item.transaction_type === 'CREDIT' ? 'carbon:arrow-down' : 'iconoir:arrow-tr'
                    "
                  />
                </span>
                <span class="flex flex-col">
                  <span class="font-semibold text-sm break-all">
                    {{
                      `${item.transaction_type} #${item.transaction_id}` +
                      (item.note !== '' ? `~ ${item.note}` : '')
                    }}
                  </span>
                  <span class="text-xs" v-html="item.date_time"> </span>
                </span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-sm font-semibold">
                  {{ item.amount + ' ' + item.wallet_symbol }}
                </span>
                <span class="text-xs text-uppercase">{{ item.wallet_id }}</span>
              </div>
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
      isActiveItem: null,
      loading: false,
      items: []
    }
  },

  methods: {
    getTxnHistory() {
      this.loading = true
      this.$wallet
        .transactionHistory()
        .then((res) => {
          console.log(res)
          this.items = res.data
        })
        .finally(() => {
          this.loading = false
        })
    }
  },

  beforeMount() {
    this.getTxnHistory()
  },
  
  computed: {
    
  }
}
</script>

<style></style>
