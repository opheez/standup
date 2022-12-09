<template>
    <article>
    <section class="addeyeswantedsection">
      <button class="addeyeswantedbutton"
        v-if="!this.eyeswanted"
        @click="addEyesWanted"
      >
        Eyes Wanted!
      </button>
      <button class="addeyeswantedbutton"
        v-if="this.eyeswanted"
        @click="removeEyesWanted"
      >
        Remove Eyes Wanted!
      </button>
    </section>

    <section v-if="this.eyeswanted"
        class = "viewedby">
      <p v-for="viewed in this.viewed">
        Viewed by {{ viewed }} 
      </p>
      <p v-if="!this.viewed" >
        Waiting for review. 
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
    beforeMount(){
      this.$store.commit('refreshUpdatesEyeswanted', this.$route.params.updateId);
    },
    data() {
      return {
        viewed: '',
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    computed: {
      eyeswanted() {
        const eyeswanteds = this.$store.state.updateseyeswanted[this.$route.params.updateId] || [];
        if (eyeswanteds !== []){
          console.log(this.$store.state.updateseyeswanted)
          const eyeswanted = eyeswanteds[0];
          return eyeswanted;
        }
      },
      viewedby(){
        if (this.eyeswanted){
          const unviewed = this.eyeswanted.targetUsers;
          const teammates = this.project.participants;
          for (let n=0; n < unviewed.length; n++){
            this.viewed = teammates.filter(email => !email.includes(unviewed[n].email))
          };
          return this.viewed;
        }
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
          if (!r.ok) {
            throw new Error(res.error);
          }
          const message = 'Successfully add eyes wanted!';
          this.$set(this.alerts, message, 'success');
          setTimeout(() => this.$delete(this.alerts, message), 3000);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        };
        this.$store.commit('refreshUpdatesEyeswanted', this.$route.params.updateId);
        this.eyeswanted();
      },
      async removeEyesWanted() {
         /**
         * Logged in user unfollows another user
         */
         const requestOptions = {
              method: 'DELETE',
          };
        const url = `/api/eyeswanted/${this.eyeswanted._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          const message = `Successfully removed eyes wanted!`;
          this.$set(this.alerts, message, 'success');
          setTimeout(() => this.$delete(this.alerts, message), 3000);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        };
        this.$store.commit('refreshUpdatesEyeswanted', this.$route.params.updateId);
      },
    },
  };
  </script>
  
  <style scoped>

.viewedby {
  font-size: 80%;
}
  </style>