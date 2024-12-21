<template>
  <div class="">
    <!-- <h4 class="font-semibold mb-2">Transaction History</h4> -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="flex flex-col gap-4">
          <div v-for="item in 6" :key="item">
            <el-skeleton-item variant="image" style="height: 80px; border-radius: 10px" />
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, idx) in items"
              :key="idx"
              class="dark:bg-black3 bg-gray-200 p-3 flex justify-between rounded-lg"
            >
              <div class="flex gap-2">
                <!-- <span
                  class="h-8 w-8 flex items-center justify-center font-weight-bold rounded"
                  :class="[item.transaction_type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100']"
                >
                  <i-icon
                    :icon="
                      item.transaction_type === 'CREDIT' ? 'carbon:arrow-down' : 'iconoir:arrow-tr'
                    "
                  />
                </span> -->
                <span class="flex flex-col">
                  <span class="font-semibold text-sm break-all dark:text-white">
                    {{
                      `${item.transactionType} #${item._id}`
                    }}
                  </span>
                  <span class="text-xs dark:text-gray-300" v-html="$formatDate(item.createdAt)"> </span>
                </span>
              </div>
              <div class="flex flex-col items-end dark:text-gray-100">
                <span class="text-sm font-semibold">
                  {{ item.amount + ' ' + item.asset }}
                </span>
                <!-- <span class="text-xs text-uppercase">{{ item.recipientAddress }}</span> -->
              </div>
            </div>
          </div>
          <div v-if="!loading && items.length === 0" class="text-center dark:text-gray-300 text-sm text-gray-500">
            No Activity
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
          console.log(res, 'txn history')
          this.items = res
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
