<template>
    <article>
    <section class="addeyeswantedsection">
      <button class="addeyeswantedbutton"
        v-if="!existingEyesWanted"
        @click="addEyesWanted"
      >
        Eyes Wanted!
      </button>
      <button class="addeyeswantedbutton"
        v-if="existingEyesWanted"
        @click="removeEyesWanted"
      >
        Remove Eyes Wanted!
      </button>
    </section>

    <section v-if="existingEyesWanted"
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
    data() {
      return {
        viewed: '',
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    computed: {
      existingEyesWanted() {
        /**
         * Return if user has added eye wanted the update
         */
        const alleyeswanted = this.$store.state.alleyeswanted;
        const exists = alleyeswanted
                        .filter(alleyeswanted => alleyeswanted.update._id === this.update._id)
                        .length === 1;
        if (exists) {
          this.eyeswanted = alleyeswanted
                        .filter(alleyeswanted => alleyeswanted.update._id === this.update._id)[0];
        };
        return exists;
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
          this.eyeswantedId = res.eyesWanted._id;
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
        this.EyesWantedRequest('');
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
        this.EyesWantedRequest('${this.eyeswanted._id}');
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

.viewedby {
  font-size: 80%;
}
  </style>