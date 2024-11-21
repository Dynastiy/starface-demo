<template>
  <div class="flex flex-col justify-between">
    <div class="">
      <h3 class="lg:text-2xl text-center md:text-2xl text-xl font-bold mb-0">
        WITHDRAW YOUR ASSET
      </h3>
      <span class="text-[15px] block font-regular text-gray2 text-center"
        >Please ensure you input the right USDT (BEP20) wallet address.</span
      >
    </div>

    <vForm @submit="onSubmit" v-slot="{ meta }" class="mt-3 flex flex-col justify-between">
      <div class="flex flex-col gap-3">
        <div>
          <label for="">Amount</label>
          <vField name="amount" class="input" type="text" rules="required" />
          <ErrorMessage name="amount" class="text-xs text-error"></ErrorMessage>
        </div>

        <div>
          <label for="">Wallet Address</label>
          <vField name="recipientAddress" class="input" type="text" rules="required" />
          <ErrorMessage name="recipientAddress" class="text-xs text-error"></ErrorMessage>
        </div>
      </div>

      <div class="text-center mt-12">
        <button
          class="brand-btn w-full flex justify-center items-center gap-2"
          :disabled="isLoading || !meta.valid"
          :class="[
            isLoading
              ? 'bg-gray-300 text-gray'
              : meta.valid
                ? 'brand-primary-clear'
                : 'bg-gray-300 text-black1'
          ]"
        >
          <i-icon v-if="isLoading" icon="eos-icons:three-dots-loading" class="text-xl text-gray2" />
          <span v-else>Withdraw </span>
        </button>
      </div>
    </vForm>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    walletData: {
      type: Object,
      default: () => ({}) // Prevents errors if walletData is undefined or null
    }
  },

  data() {
    return {
      typePassword: true,
      isLoading: false,
      validationErrors: {}
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
        ...values,
        asset: 'usdt'
      }
      this.$wallet
        .withdraw(payload)
        .then((res) => {
          this.$emit('refresh')
          console.log(res)
          resetForm()
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    getUser() {
      this.$auth
        .getProfile()
        .then((res) => {
          let profile = res.user
          console.log(profile)
          this.$store.commit('auth/setUser', profile)
          // if(profile.email_verified_at == null) {
          //   this.$router.push(`/verify-email?email=${profile.email}`)
          // }
          // else {
          let redirectFrom = this.$route.query.redirect
          let urlTo = redirectFrom ? redirectFrom : '/'
          this.$router.push(urlTo)
          // }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    }
  }
}
</script>
