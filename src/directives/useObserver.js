export default {
    mounted(el, binding) {
      const options = {
        root: null,          // Observe the viewport
        rootMargin: '0px',   // No margin
        threshold: 0.5,      // Trigger when 50% of the element is visible
      };
  
      // Create an IntersectionObserver instance
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (binding.value && typeof binding.value === 'function') {
              binding.value(true, el); // Call the bound function with inView=true
            }
          } else {
            if (binding.value && typeof binding.value === 'function') {
              binding.value(false, el); // Call the bound function with inView=false
            }
          }
        });
      }, options);
  
      // Attach the observer to the element
      observer.observe(el);
  
      // Save the observer instance on the element for cleanup
      el.__observer = observer;
    },
    unmounted(el) {
      // Disconnect the observer when the element is removed
      if (el.__observer) {
        el.__observer.disconnect();
        delete el.__observer; // Clean up the property
      }
    },
  };
  