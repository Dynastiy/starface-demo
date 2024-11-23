<template>
  <div class="flex gap-6 p-4 items-start lg:flex-row md:flex-row flex-col pb-[80px]">
    <div class="lg:w-6/12 md:w-6/12 w-full rounded-md flex justify-center">
      <div class="w-full flex flex-col gap-4">
        <div
          :style="getBackgroundStyle(info.profilePicture)"
          class="w-[100%] h-[400px] relative bg-no-repeat bg-cover bg-center mx-auto p-4 rounded-md"
        >
          <div class="overlay p-4">
            <div class="flex items-center justify-between w-full">
              <h4 class="font-bold text-white text-xl">{{ info.userName }}</h4>
              <div class="flex items-center gap-2">
                <button class="brand-primary brand-btn rounded-full shadow">
                  <i-icon icon="fontisto:close-a" class="text-xl text-white" />
                </button>
                <button class="brand-primary brand-btn rounded-full shadow">
                  <i-icon icon="streamline:star-1-solid" class="text-xl text-white" />
                </button>
                <button class="brand-primary brand-btn rounded-full shadow">
                  <i-icon icon="icon-park-solid:like" class="text-xl text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- <h5 class="text-center text-lg text-center font-bold mt-2">Nicey, 45</h5>
        <span class="flex gap-1 justify-center">
          <i-icon icon="ic:baseline-location-on" />
          <span class="text-xs">Montreal, Canada</span>
        </span> -->
        <div>
          <span class="text-sm block text-gray-500">Bio</span>
          <p class="text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione incidunt accusamus
            molestias aliquam laboriosam ipsam ex non veniam iste, enim modi, ducimus totam!
            Similique eos labore eius minus expedita? Modi!
          </p>
        </div>

        <div>
          <span class="text-sm block text-gray-500">Interests</span>
          <span class="flex gap-2 flex-wrap">
            <span class="bg-gray-100 border border-gray-200 px-2 py-1 text-xs rounded-xl" v-for="item in info.interests" :key="item">{{item}}</span>
          </span>
        </div>

        <div>
          <span class="text-sm block text-gray-500">Languages</span>
          <span class="flex gap-2 flex-wrap">
            <span class="bg-gray-100 border border-gray-200 px-2 py-1 text-xs rounded-xl" v-for="item in ['spanish', 'english', 'german']" :key="item">{{item}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Edit from '@/components/profile/Edit.vue'
// import Transactions from '@/components/profile/Transactions.vue'
// import Referral from '@/components/profile/Referral.vue'
// import { markRaw } from 'vue'
import image from '@/assets/img/no-user.png'

export default {
  // components: { Edit, Transactions },
  data() {
    return {
      image,
      form: {
        first_name: '',
        last_name: '',
        phone_number: '',
        country: '',
        region_state_province: '',
        city: '',
        bio: '',
        date_of_birth: '',
        gender: '',
        profile_picture_url: ''
      },
   info: {},
      activeTab: 0,
      userID: this.$route.params.id
    }
  },

  methods: {
    activateTab(e) {
      this.activeTab = e
    },
    getUser() {
      this.$auth.getUser(this.userID).then((res) => {
        console.log(res)
        this.info = res.user
      })
    },
    getBackgroundStyle(image) {
      const img = new Image();
      img.src = image;

      return {
        backgroundImage: `url('${img.complete && img.naturalWidth !== 0 ? image : this.$avatar}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    },
  },

  watch: {
    user: {
      handler(val) {
        this.form = val
      },
      immediate: true,
      deep: true
    }
  },

  beforeMount() {
    this.getUser()
  },

  computed: {
    user() {
      return this.$store.getters['auth/getUser']
    },
    userMeta() {
      return this.$store.getters['auth/getUserMeta']
    },
    timeLeft() {
      return (
        this.userMeta.subscription_fee_expiration_time_of_last_payment -
        this.userMeta.subscription_fee_transaction_time_of_last_payment
      )
    }
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  bottom: 0;
  /* padding: 15px 200px; */
  left: 0;
  width: 100%;
  min-height: 200px; /* Adjust height as needed */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent); /* Smooth blend */
  display: flex;
  align-items: end;
  justify-content: space-between;
  border-radius: 0.375rem;
}

.overlay-content {
  color: white;
  padding: 10px;
  text-align: center;
}
</style>
