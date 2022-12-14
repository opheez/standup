<template>
    <article>
    <section class="addeyeswantedsection">
      <h4 v-if="!existingEyesWanted">Ask your team to read this update:</h4>
      <h4 v-else-if="existingEyesWanted && !waitingFor.length">Your team has already read this update.</h4>
      <h4 v-else>You've asked your team to read this update.</h4>
      <button class="addeyeswantedbutton thin-btn"
        v-if="!existingEyesWanted || !waitingFor.length"
        @click="addEyesWanted"
      >
        {{!waitingFor.length ? 'Re-request eyes wanted!' : 'Eyes wanted!'}} 
      </button>
      <button class="addeyeswantedbutton thin-btn invert"
        v-if="existingEyesWanted && waitingFor.length"
        @click="removeEyesWanted"
      >
        Mark as resolved and cancel
      </button>
    </section>

    <section v-if="existingEyesWanted"
        class = "waitingFor">
      <p v-if="waitingFor.length">
        Waiting for reviews from: {{ waitingFor.join(', ') }} 
      </p>
      <p v-else>
        All your teammates have read this update!
      </p>
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
    name: 'AddEyesWantedComponent',
    props: {
      // Data from the stored update
      update: {
        type: Object,
        required: true
        },
      project: {
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
      existingEyesWanted() {
        /**
         * Return if user has added eye wanted the update
         */
        return this.$store.state.alleyeswanted[this.update._id];
      },
      waitingFor(){
        if (this.existingEyesWanted){
          return this.existingEyesWanted.targetUsers.map(user => user.email);
        }
        return this.project.participants;
      }
    },
    methods: {
      async addEyesWanted() {
        const body = {
          updateId: this.update._id,
        };
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body)
        };
        const url =`/api/eyeswanted/`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          this.eyeswantedId = res.eyesWanted._id;
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('refreshUpdateEyesWanted', this.update._id); 
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        };
      },
      async removeEyesWanted() {
         /**
         * Logged in user unfollows another user
         */
         const requestOptions = {
              method: 'DELETE',
          };
        const url = `/api/eyeswanted/${this.existingEyesWanted._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('refreshUpdateEyesWanted', this.update._id);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        };
      }
    },
  };
  </script>
  
  <style scoped>
h4 {
  margin-bottom: 8px;
}
.waitingFor {
  font-size: 80%;
  color:rgb(125, 125, 125);
}
button + button {
  margin-left: 8px;
}
</style>
