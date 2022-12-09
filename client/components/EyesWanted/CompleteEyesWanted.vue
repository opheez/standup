<template>
    <article>
    <section 
    class="addeyeswantedsection">
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
       eyeswanted: {
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
        const url = `/api/eyeswanted/${this.eyeswanted._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          const message = `Successfully read update!`;
          this.$set(this.alerts, message, 'success');
          this.$store.commit('refreshEyesWanted');
          setTimeout(() => this.$delete(this.alerts, message), 3000);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        };
      },
    },
  };
  </script>
  
  <style scoped>
  </style>