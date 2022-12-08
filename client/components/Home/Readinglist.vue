<template>
  <div class="container">
    <main class="left-panel" :class="{thin: $store.state.currentUpdate}">
      <h1>
        Reading List
      </h1>
      <template
      v-for="eyeswanted in $store.state.eyeswanted">
      <UpdatePreview
        :update="eyeswanted.update"
        :openUpdate="openUpdate" />
    </template>
    <article v-if="$store.state.eyeswanted.length===0">
      <p> No eyes wanted updates. </p>
    </article>
    </main>
    <div class="details-container" v-show="$store.state.currentUpdate">
      <button @click="hideUpdate" class="text-btn thin-btn">
        Hide >
      </button>
      <UpdateDetailPage
        v-if="$store.state.currentUpdate"
        class="update-details"
        :showProjectTitle="true"
        :project="$store.state.projects.find(p => p._id === $store.state.currentUpdate.projectId)"
        :update="$store.state.currentUpdate"
      />
    </div>
  </div>
</template>
  
  <script>
  import UpdatePreview from '@/components/Update/UpdatePreview.vue';
  import UpdateDetailPage from '@/components/Update/UpdateDetailPage.vue';
  
  export default {
    name: 'ReadingList',
    components: {UpdatePreview, UpdateDetailPage},
    beforeMount() {
      this.$store.commit('refreshEyesWanted');
    },
    computed: {
      eyeswanted() {
        const eyeswanted = this.$store.state.eyeswanted || [];
        return eyeswanted;
      }
    },
    methods: {
      openUpdate(update) {
        if (update === this.$store.state.currentUpdate) {
          this.$store.commit('setCurrentUpdate', null);  
          return;
        }
        this.$store.commit('setCurrentUpdate', update);
      },
      hideUpdate() {
        this.$store.commit('setCurrentUpdate', null);
      }
    },
  }
  </script>
  
  <style scoped>
  .user-updates {
    padding-bottom: 8px;
  }
  
  .add-update-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }

  .readingList{
    height: 20em;
    overflow: auto;
  }
  </style>
  