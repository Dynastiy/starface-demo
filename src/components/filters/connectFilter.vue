<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
// import { getCountries } from "@/services/auth";

// import Slider from 'primevue/slider';

const route = useRoute()
const router = useRouter()

const emit = defineEmits(['applyFilter', 'closeFilterModal'])
const ageValue = ref([18, 34])

const filters = ref({
  location: '',
  minAge: ageValue.value[0],
  maxAge: ageValue.value[1],
  gender: '',
  // search: ''
})

const applyFilter = async () => {
  console.log('Applied Filters:', filters.value)
  emit('applyFilter', JSON.stringify(filters.value))
  emit('closeFilterModal')
}

const closeFilter = () => {
  emit('closeFilterModal')
}

const clearFilter = () => {
    emit('closeFilterModal')
    // console.log(route)
  router.replace({
    path: route.path, // Keep the current path
    query: {} // Clear the query parameters
  })
  
}
</script>

<template>
  <div class="">
    <div class="">
      <div class="flex items-center justify-between">
        <h2 class="text-xl text-[#767676] font-medium mb-4">Filter</h2>
        <button @click="closeFilter" class="text-red-500 hover:text-primary text-sm">Close</button>
      </div>

      <form class="flex flex-col space-y-4" @submit.prevent="applyFilter">
        <!-- Name Input -->
        <!-- <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            v-model="filters.search"
            placeholder="Enter name"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-primary"
          />
        </div> -->

        <div>
          <label for="age" class="block text-sm font-medium text-gray-700">Age Range</label>
          <el-slider v-model="ageValue" range :max="65" :min="18" />
        </div>

        <!-- Location Input -->
        <div>
          <label for="age" class="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="age"
            v-model="filters.location"
            placeholder="Enter Location"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-primary"
          />
        </div>

        <!-- Gender Radio Buttons -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Gender</label>
          <div class="mt-1 space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                value="male"
                v-model="filters.gender"
                class="text-primary3 focus:ring-primary"
              />
              <span class="ml-2">Male</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                value="female"
                v-model="filters.gender"
                class="text-primary3 focus:ring-primary"
              />
              <span class="ml-2">Female</span>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <button
            type="submit"
            class="w-full bg-primary font-regular text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:ring-primary"
          >
            Apply Filter
          </button>
          <span role="button" class="mt-3 block text-red-600 underline text-sm" @click="clearFilter">
            Clear Filter
          </span>
        </div>
      </form>
    </div>
  </div>
</template>
