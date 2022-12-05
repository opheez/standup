<template>
    <article>
    <section class="addeyeswantedsection">
      <button class="addeyeswantedbutton"
        @click="completeEyesWanted"
      >
        Read!
      </button>
    </section>

      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
      </article>
  </template>
  
  <script>
  export default {
    name: 'CompleteEyesWantedComponent',
    props: {
      // Data from the stored update
      update: {
        type: Object,
        required: true
        },
       eyewanted: {
        type: Object,
        required: true
        }, 
    },
    data() {
      return {
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    methods: {
      async completeEyesWanted() {
         /**
         * Mark an eye wanted update as complete
         */
         const requestOptions = {
              method: 'PATCH',
          };
        console.log(this.eyewanted);
        const url = `/api/eyeswanted/${this.eyewanted._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          const message = `Successfully removed thanks!`;
          this.$set(this.alerts, message, 'success');
          setTimeout(() => this.$delete(this.alerts, message), 3000);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async EyesWantedRequest(params) {
        /**
         * Submits a request to the like's endpoint
         * @param params - Options for the request
         * @param params.body - Body for the request, if it exists
         * @param params.callback - Function to run if the the request succeeds
         */
        const options = {
          method: params.method, 
          headers: {'Content-Type': 'application/json'},
        };
        if (params.body) {
          options.body = params.body;
        }
        try {
          const r = await fetch('/api/eyeswanted', options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('refreshAllEyesWanted'); 
          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        
      }
    },
  };
  </script>
  
  <style scoped>
  </style>