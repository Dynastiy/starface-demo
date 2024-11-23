<template>
  <div>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4 mt-4">
          <div v-for="item in 5" :key="item">
            <el-skeleton-item variant="image" style="height: 150px; border-radius: 10px" />
          </div>
        </div>
      </template>
      <template #default>
        <div>
          <div class="flex flex-col gap-2">
            <div
              v-for="(item, i) in fees"
              :key="i"
              class="p-4 border rounded-md w-full flex flex-col bg-white gap-1 justify-between"
              @click="selectFees(item)"
            >

            <!-- <div
              v-for="(item, i) in fees"
              :key="i"
              class="p-4 border rounded-md w-full flex flex-col bg-white gap-1 justify-between"
              :class="[
                isActiveItem === changeTitle(item.subscription_name)
                  ? 'border-primary'
                  : 'border-gray-200'
              ]"
              @click="selectFees(item)"
            > -->
              <div class="">
                <span class="mb-2 block">
                  <h5 class="font-bold capitalize text-lg w-full text-center">{{ upgradeImages[i].name.split('_').join(' ') }}</h5>
                  <h6 class="text-sm text-gray-600 text-center">Buy and get up to <b>{{ `${item.usdtToReceive}USDT` }}</b> per cycle</h6>
                  <!-- <span class="text-xs block text-gray-400">{{
                    item.USDT
                  }}</span> -->
                </span>
                <img :src="upgradeImages[i].icon" class="w-[100px] mx-auto" alt="">
                <!-- <span
                  class="text-sm font-medium text-gray-400"
                  v-if="item.discount_applied !== 0"
                  >{{ `${item.discount_applied}% OFF` }}</span
                > -->
              </div>
              <div>
                <hr class="my-2">
                <h2 class="font-bold text-center text-3xl">
                  {{ `${item.USDT}`
                  }}<span class="text-sm text-gray-400 font-medium"> USDT</span>
                </h2>
                <!-- <h2 class="font-semibold text-xl">
                  {{ `${item.STAR}`
                  }}<span class="text-sm text-gray-400 font-medium"> STAR</span>
                </h2> -->
                
                <!-- <h6 class="text-sm text-gray-600">Buy and get up to <b>{{ `${item.usdtToReceive}USDT` }}</b> or <b>{{ `${item.starToReceive}STAR` }}</b> per cycle</h6> -->
              </div>
              <!-- <h6></h6>
              <div>
              {{item}}
              </div>

              <div>
                {{upgradeImages[i]}}
              </div> -->
              <button
                class="brand-btn brand-primary-clear w-full"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import green from '@/assets/img/icons/green-starface.png'
import blue from '@/assets/img/icons/blue-starface.png'
import philemon from '@/assets/img/icons/red-coin.png'
import bronze from '@/assets/img/icons/bronze-coin.png'
import purple from '@/assets/img/icons/purple-coin.png'
import gold from '@/assets/img/icons/gold-coin.png'
import founder from '@/assets/img/icons/info-coin.png'

export default {
  data() {
    return {
      fees: [],
      isActiveItem: null,
      loading: false,
      upgradeFees: [],
      upgradeImages: [
      {
        name: 'ocean_green',
        icon: green,
      },
      {
        name: 'blue_mars',
        icon: blue,
      },
      {
        name: 'philemon',
        icon: philemon,
      },
      {
        name: 'bronze',
        icon: bronze,
      },
      {
        name: 'purple_bee',
        icon: purple,
      },
      {
        name: 'ethiopian_gold',
        icon: gold,
      },
      {
        name: 'founder',
        icon: founder,
      }
      ]
    }
  },

  methods: {
    selectFees(e) {
      this.isActiveItem =
        this.isActiveItem && this.isActiveItem === this.changeTitle(e.subscription_name)
          ? null
          : this.changeTitle(e.subscription_name)
      const data_to_emit = this.isActiveItem ? e : null
      this.$emit('selectedFees', data_to_emit)
    },

    changeTitle(value) {
      let req = value.split(' ').join('_').toLowerCase()
      return req
    },

    getSubscriptions() {
      this.loading = true
      this.$wallet
        .getSubsciptionPlans()
        .then((res) => {
          console.log(res)
          this.fees = res
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
