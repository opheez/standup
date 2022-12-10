<template>
    <article>
    <section class="addthankssection">
      <button class="thanksbutton"
        v-if="!existingThanks"
        @click="addThanks"
      >
        Thanks!
      </button>
      <button class="thanksbutton"
      v-if="existingThanks"
        @click="removeThanks"
      >
        Remove Thanks!
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
    name: 'AddThanksComponent',
    props: {
      // Data from the stored update
      update: {
        type: Object,
        required: true
        },
    },
    data() {
      return {
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    computed: {
      existingThanks() {
        /**
         * Return if user has thanked the update
         */
        const allThanks = this.$store.state.allthanks;
        const exists = allThanks
                        .filter(thanks => thanks.postUser.email === this.$store.state.email)
                        .filter(filtered => filtered.updateId._id === this.update._id)
                        .length === 1;
        return exists;
      },
    },
    methods: {
      async addThanks() {
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify()
        };
          const url =`/api/thanks/${this.update._id}`;
          try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          const message = 'Successfully add thanks!';
          this.$set(this.alerts, message, 'success');
          setTimeout(() => this.$delete(this.alerts, message), 3000);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        };
        this.ThanksRequest('');
      },
      async removeThanks() {
         /**
         * Logged in user unfollows another user
         */
         const requestOptions = {
              method: 'DELETE',
          };
        const url = `/api/thanks/${this.update._id}`;
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
        };
        this.ThanksRequest('${this.update._id}');
      },
      async ThanksRequest(params) {
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
          const r = await fetch('/api/thanks', options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('refreshAllThanks', this.update._id); 
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