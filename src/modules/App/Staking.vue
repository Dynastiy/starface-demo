<template>
  <div class="p-4 pb-[80px]">
    <div class="flex justify-between mb-4">
      <h4 class="font-semibold mb-2 dark:text-gray-100">Staking History</h4>
      <button
        class="brand-btn brand-primary-clear py-2 text-xs"
        v-if="items.length > 0 && !loading"
        @click="showContainer = true"
      >
        Stake
      </button>
    </div>
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
              class="dark:bg-black3 bg-gray-200  p-3 flex justify-between rounded-lg"
            >
              <div class="flex gap-2">
                <span class="flex flex-col">
                  <span class="font-semibold dark:text-white text-sm break-all">
                    {{ `#${item._id}` }}
                  </span>
                  <div class="flex flex-col">
                    <span class="text-xs dark:text-gray-100" v-html="`<b>ROI:</b> ${item.roi}`"> </span>
                    <span
                      class="text-xs dark:text-gray-200"
                      v-html="`<b>Start Date:</b> ${$formatDate(item.startDate)}`"
                    >
                    </span>
                    <span
                      class="text-xs dark:text-gray-200"
                      v-html="`<b>Start Date:</b> ${$formatDate(item.endDate)}`"
                    >
                    </span>
                  </div>
                </span>
              </div>
              <div class="flex flex-col items-end">
                <div class="flex gap-2 items-center">
                  <span :class="['status', item.status]">{{ item.status }}</span>
                  <button v-if="item.status == 'active'" @click="unstake(item)" class="text-sm text-red-500 underline">
                    Unstake
                  </button>
                </div>
                <span class="text-sm font-semibold dark:text-gray-200">
                  {{ item.amount + ' SFC' }}
                </span>
                <!-- <span class="text-xs text-uppercase">{{ item.recipientAddress }}</span> -->
              </div>
            </div>
          </div>

          <div v-if="items.length == 0 && !loading" class="flex flex-col gap-1 mt-8 items-center">
            <i-icon icon="streamline:investment-selection-solid" class="text-4xl" />
            <span class="text-xl dark:text-gray-300 text-sm text-gray-500 font-semibold">No Stakings yet!</span>
            <button
              class="brand-btn brand-primary-clear py-2 text-xs"
              @click="showContainer = true"
            >
              Stake Now
            </button>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- Modal for Staking  -->
    <vDialog
      v-model:visible="showContainer"
      modal
      :style="{ width: '80%' }"
      @hide="closeContainer"
      @after-hide="closeContainer"
      :showHeader="false"
      unstyled
      :pt="{
        root: 'border-none',
        mask: {
          style: 'backdrop-filter: blur(4px)'
        }
      }"
    >
      <div class="bg-white p-6 shadow rounded-lg">
        <span role="button" @click="closeContainer">
          <i-icon icon="ic:baseline-arrow-back" class="text-2xl font-semibold" />
        </span>
        <stake :starBalance="starBalance" @refresh="refresh" />
      </div>
    </vDialog>
  </div>
</template>

<script>
import Stake from '@/components/Stake.vue'
export default {
  components: { Stake },
  data() {
    return {
      isActiveItem: null,
      loading: false,
      items: [],
      showContainer: false,
      starBalance: 0
    }
  },

  methods: {
    getStakingHistory() {
      this.loading = true
      this.$userActivity
        .getStakes()
        .then((res) => {
          console.log(res, 'staking history')
          this.items = res.stakes
          this.getAllWallets()
        })
        .finally(() => {
          this.loading = false
        })
    },

    refresh() {
      // refresh
    },

    unstake(e) {
      console.log(e)
      this.$userActivity.unstake(e._id).then(() => {
        this.getStakingHistory()
        this.getAllWallets()
      })
    },

    closeContainer() {
      this.showContainer = false
    },

    getAllWallets() {
      this.$wallet.earnWallet().then((res) => {
        console.log(res)
        this.starBalance = res.star.balance
      })
    }
  },

  mounted() {
    this.getStakingHistory()
    this.getAllWallets()
  },

  computed: {}
}
</script>

<style></style>
