<template>
  <div class="">
    <!-- <Loader v-if="isLoading" /> -->
     <Loader v-if="isLoading">
      <template #counter>
        <span v-if="uploadProgress > 0">{{ `${Math.ceil(uploadProgress)}%` }}</span>
      </template>
      </Loader>
    <div class="flex flex-col justify-between">
      <!-- <span>{{ uploadProgress }}</span> -->
      <div class="mt-4">
        <div
          class="dropzone-container group relative flex flex-col items-center justify-center text-center"
          @dragover="dragover"
          @dragleave="dragleave"
          @drop="drop"
        >
          <input
            type="file"
            name="file"
            id="fileInput"
            class="hidden-input"
            @change="onChange"
            ref="file"
            accept="video/*"
          />

          <label for="fileInput" class="file-label mb-0 flex flex-col items-center">
            <i-icon icon="tabler:video-filled" class="text-[30px]" />
            <div v-if="isDragging">Release to drop files here.</div>
            <div v-else class="text-[14px] font-medium mb-0">Upload video or drag and drop</div>
          </label>
        </div>
        <div class="flex flex-col mt-2" v-if="image">
          <span class="text-gray-400 text-xs block">
            {{ image.name }} ({{ formattedImageSize(image) }})</span
          >
          <div class="flex gap-2">
            <label for="fileInput" class="file-label">
              <span class="text-primary-600 text-xs font-medium block">Replace</span>
            </label>
            <span class="text-red-600 text-xs font-medium block" role="button" @click="removeImage">
              Remove
            </span>
          </div>
        </div>
      </div>

      <div class="form">
        <!-- <div>
          <label for="">Title</label>
          <input type="text" v-model="title" placeholder="Enter a title..." class="input" />
        </div> -->

        <div>
          <label for="">Description</label>
          <textarea
            placeholder="Write a brief description for this post"
            v-model="description"
            name=""
            id=""
            rows="4"
            class="input"
          ></textarea>
        </div>
      </div>

      <div class="text-center mt-4">
        <button
          @click="onSubmit"
          class="brand-btn w-full flex justify-center items-center gap-2"
          :disabled="isLoading"
          :class="[isLoading ? 'bg-gray-300 text-gray' : 'brand-primary-clear']"
        >
          <i-icon v-if="isLoading" icon="eos-icons:three-dots-loading" class="text-xl text-gray2" />
          <span v-else> Upload this video </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/plugins/socket'
export default {
  props: {
    uploadProgressValue: Number
  },
  data() {
    return {
      isLoading: false,
      image: null,
      isDragging: false,
      file: null,
      description: '',
      title: '',
      uploadProgress: 0
    }
  },

  methods: {
    onSubmit() {
      this.isLoading = true

      const formData = new FormData()
      formData.append('postType', 'video')
      formData.append('file', this.image)
      formData.append('title', this.title)
      formData.append('description', this.description)

      this.$feeds
        .create(formData)
        .then((res) => {
          this.$emit('completed')
          return res
        })
        .finally(() => {
          this.isLoading = false
        })
      return
    },

    onChange() {
      this.files = this.$refs.file.files
      this.image = this.files[0]
      console.log(this.image)
    },

    dragover(e) {
      e.preventDefault()
      this.isDragging = true
    },

    dragleave() {
      this.isDragging = false
    },

    drop(e) {
      e.preventDefault()
      this.$refs.file.files = e.dataTransfer.files
      this.onChange()
      this.isDragging = false
    },

    removeImage() {
      this.image = null
    },

    generateURL() {
      let fileSrc = URL.createObjectURL(this.files[0])
      console.log(fileSrc)
      this.file = fileSrc
      return fileSrc
    },

    formattedImageSize(image) {
      if (image < 1024) {
        return `${image.size.toFixed(2)} Bytes`
      } else if (image.size < 1048576) {
        return `${(image.size / 1024).toFixed(2)} KB`
      } else {
        return `${(image.size / 1048576).toFixed(2)} MB`
      }
    }
  },

  mounted() {
    // Listen for progress updates
    socket.on('uploadProgress', (data) => {
      if (data.step == 'started') {
        console.log('Upload started')
      } else if (data.step == 'processing' || data.step == 'hlsProcessing' ) {
        // console.log(`Processing: ${data.progress}%`)
        this.uploadProgress = data.progress
      } else if (data.step == 'completed') {
        console.log('Upload completed successfully!')
      } else if (data.step == 'error') {
        console.error('Error during upload:', data.error)
      }
    })
  },

  watch: {
    // uploadProgressValue: {
    //   handler(val) {
    //     console.log('uploadProgressValue changed:', val)
    //   },
    //   immediate: true
    // }
  },

  computed: {
    uid() {
      return this.$route.query.uid
    }
  }
}
</script>

<style scoped>
.dropzone-container {
  height: 150px;
  width: 100%;
  background: var(---gray-200);
  border: 2px solid var(---gray-500);
  /* border-style: ; */
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.file-label {
  font-size: 20px;
  display: block;
  cursor: pointer;
}

.preview-container {
  display: flex;
  margin-top: 2rem;
}

.preview-card {
  display: flex;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin-left: 5px;
}

.preview-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #a2a2a2;
  background-color: #a2a2a2;
}
</style>
