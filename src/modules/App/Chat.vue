<template>
  <div class="p-4 flex flex-col gap-4">
    <div>
      <!-- <span>Search here</span> -->
      <div class="flex gap-1 pl-2 items-center bg-white rounded-md">
        <i-icon icon="uil:search" />
        <input
          type="text"
          placeholder="Search Here"
          class="flex-1 p-2 outline-none placeholder:text-sm text-[13px]"
        />
      </div>
    </div>

    <div>
      <h4 class="font-semibold">New Matches</h4>
      <div class="flex gap-3 overflow-y-scroll">
        <div v-for="item in 4" :key="item" class="flex flex-col items-center">
          <img
            class="h-[42px] w-[42px] rounded-full"
            src="http://test.starface.chat/assets/images/avatar/6.jpg"
            alt=""
          />
          <span class="text-xs text-gray-500">John Doe</span>
        </div>
      </div>
    </div>

    <div>
      <h4 class="font-semibold">Messages</h4>
      <div class="flex flex-col gap-4">
        <div class="flex justify-between bg-white p-2 rounded-md" v-for="item in 4" :key="item">
          <span class="flex gap-2 items-center">
            <img
              class="h-[42px] w-[42px] rounded-full"
              src="http://test.starface.chat/assets/images/avatar/6.jpg"
              alt=""
            />
            <span>
              <h5 class="font-semibold text-md">John Doe</h5>
              <h6 class="text-xs">This is a message body!</h6>
            </span>
          </span>
          <span class="text-xs text-gray-400"> 2m Ago </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
