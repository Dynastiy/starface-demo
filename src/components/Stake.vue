<template>
  <div class="flex flex-col justify-between">
    <div class="">
      <h3 class="lg:text-2xl text-center md:text-2xl text-xl font-bold mb-0">STAKE</h3>
      <span class="text-[15px] block font-regular text-gray2 text-center"
        >Stake Your SFC, Grow Your Rewards!.</span
      >
    </div>
    <vForm @submit="onSubmit" v-slot="{ meta }" class="mt-3 flex flex-col justify-between">
      <div class="flex flex-col gap-3">
        <div>
          <label for="">Amount</label>
          <vField name="amount" v-model="amount" class="input" type="text" rules="required" />
          <ErrorMessage name="amount" class="text-xs text-error"></ErrorMessage>
          <span class="text-xs block font-semibold">SFC Balance: {{ walletBalance }}</span>
          <span class="text-xs text-error block" v-if="walletBalance < 0"
            >*You cannot transfer an amount above your balance</span
          >
        </div>
      </div>

      <div>
        <label for="">Select Plan</label>
        <vField name="plan" as="select" class="input">
          <option value="" disabled selected>--Select Plan--</option>
          <option value="10days">10days</option>
          <option value="30days">30days</option>
          <option value="3months">3months</option>
        </vField>
        <ErrorMessage name="plan" class="text-xs text-error"></ErrorMessage>
      </div>

      <div class="text-center mt-8">
        <button
          class="brand-btn w-full flex justify-center items-center gap-2"
          :disabled="checkState || !meta.valid"
          :class="[
            checkState
              ? 'bg-gray-300 text-gray'
              : meta.valid
                ? 'brand-primary-clear'
                : 'bg-gray-300 text-black1'
          ]"
        >
          <i-icon v-if="isLoading" icon="eos-icons:three-dots-loading" class="text-xl text-gray2" />
          <span v-else>Stake</span>
        </button>
      </div>
    </vForm>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    starBalance: {
      type: Number,
      default: 0 // Prevents errors if walletData is undefined or null
    }
  },
  data() {
    return {
      typePassword: true,
      isLoading: false,
      validationErrors: {},
      walletInfo: null,
      amount: 0
    }
  },

  mounted() {
    // const isLoggedIn = this.$store.getters['auth/getAuthenticated']
    // if (isLoggedIn) {
    //   this.$router.push('/profile')
    // }
  },

  methods: {
    async onSubmit(values, { resetForm }) {
      this.isLoading = true
      let payload = {
        amount: +values.amount,
        ...values
      }
      this.$userActivity
        .stake(payload)
        .then((res) => {
          this.$emit('refresh')
          console.log(res)
          resetForm()
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },

  watch: {
    starBalance: {
      handler(val) {
        this.walletInfo = val
      },
      immediate: true
    }
  },

  computed: {
    walletBalance() {
    //   let walletBalance = this.walletInfo.SFC
      let balanceLeft = this.walletInfo - this.amount
      return balanceLeft
    },

    checkState() {
      return this.isLoading || this.starBalance < 0
    }
  }
}
</script>
