<template>
  <div class="video-container">
    <div v-for="video in videos" :key="video.id" class="video-item">
      <video
        ref="video"
        class="video"
        :src="video.videoUrl"
        preload="auto"
        muted
        loop
        @loadeddata="onVideoLoaded"
        :data-video="video.id"
      >
        <source :src="video.videoUrl" type="video/mp4" />
        <img :src="video.thumbnailUrl" alt="thumbnail" class="video-thumbnail" />
      </video>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      videos: [] // Array to hold videos from the API
    }
  },
  methods: {
    async fetchVideos() {
      try {
        // Replace with your actual API URL
        const response = await this.$reels.list()
        this.videos = response.reels
      } catch (error) {
        console.error('Error fetching videos: ', error)
      }
    },
    onVideoLoaded(event) {
      // The video has loaded successfully
      console.log(`Video ${event.target.dataset.video} is ready to play.`)
    },
    handleVideoVisibility(entries, observer) {
      entries.forEach((entry) => {
        const video = entry.target

        if (entry.isIntersecting) {
          video.play() // Play the video when it's in view
        } else {
          video.pause() // Pause when out of view
        }
      })
    }
  },
  mounted() {
    // Fetch videos from the API when the component is mounted
    this.fetchVideos()

    // Setting up IntersectionObserver for videos
    const observer = new IntersectionObserver(this.handleVideoVisibility, {
      threshold: 0.5 // 50% of the video should be visible to trigger play
    })

    // Observe each video element
    this.$nextTick(() => {
      this.$refs.video.forEach((video) => observer.observe(video))
    })
  }
}
</script>

<style scoped>
.video-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.video-item {
  width: 100%;
  height: 100vh;
  position: relative;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
