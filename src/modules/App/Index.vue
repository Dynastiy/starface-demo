<template>
  <div class="reels-container">
    <div v-for="(video, index) in videos" :key="index" class="reel">
      <video
        :src="video.videoUrl"
        class="reel-video"
        controls
        muted
        loop
        preload="none"
        v-observe="(inView, el) => handleIntersection(inView, el, index)"
      >
        Your browser does not support HTML5 video.
      </video>
    </div>

    <div v-if="loading" class="loading">
      Loading new videos...
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  data() {
    return {
      videos: [],       // Array to store video data
      loading: false,   // Loading state for fetching new videos
    };
  },
  methods: {
    async fetchVideos() {
      try {
        this.loading = true;
        const response = await this.$reels.list(); // Adjust API endpoint
        this.videos = response.reels; // Replace the current videos with a new batch
        this.loading = false;
      } catch (error) {
        console.error('Error fetching videos:', error);
        this.loading = false;
      }
    },
    handleIntersection(inView, el, index) {
      const video = el;

      if (inView) {
        video.play(); // Play video when it enters the viewport
      } else {
        video.pause(); // Pause video when it leaves the viewport
      }

      // Load a new set of videos if the last video is in view
      if (inView && index === this.videos.length - 1 && !this.loading) {
        this.fetchVideos();
      }
    },
  },
  mounted() {
    this.fetchVideos(); // Load initial set of videos
  },
};
</script>

<style>
.reels-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.reel {
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
}

.reel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}
</style>
