<template>
    <article>
    <section class="addthankssection">
      <button class="thanksbutton thin-btn invert"
        v-if="!existingThanks"
        @click="addThanks"
      >
        🙌 Thanks!
      </button>
      <button
        v-if="existingThanks"
        class="thanksbutton thin-btn invert active"
        @click="removeThanks"
      >
        🙌 Remove Thanks!
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
        const allThanks = this.$store.state.allthanks[this.update._id] || [];
        return allThanks.find(t => t.postUser.email === this.$store.state.email);
      },
    },
    methods: {
      async addThanks() {
        this.updateThanks({
          method: 'POST',
          successMessage: 'Successfully conveyed thanks!'
        });
      },
      async removeThanks() {
        this.updateThanks({
          method: 'DELETE',
          successMessage: 'Successfully removed thanks!'
        });
      },
      async updateThanks(params) {
        const requestOptions = {
          method: params.method,
        };
        const url = `/api/thanks/${this.update._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('alert', {
            status: 'success',
            message: params.successMessage,
          });
          this.$store.commit('refreshAllThanks', this.update._id);
        } catch (e) {
          this.$store.commit('alert', {
            status: 'error',
            message: e,
          });
        };
      }
    },
  };
  </script>
  
  <style scoped>
  </style>