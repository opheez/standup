<template>
    <main>
      <h1>
        Reading List
      </h1>
      <template
      v-for="eyeswanted in $store.state.eyeswanted">
      <UpdatePreview :update="eyeswanted.update" />
    </template>
    <article v-if="$store.state.eyeswanted.length===0">
        <p> No eyes wanted updates. </p>
    </article>
    </main>
  </template>
  
  <script>
  import UpdatePreview from '@/components/Update/UpdatePreview.vue';
  // import GetCurrentProject from '@/components/Update/GetCurrentProject.vue';
  
  export default {
    name: 'ReadingList',
    // mixins: [GetCurrentProject],
    components: {UpdatePreview},
    beforeMount() {
      this.$store.commit('refreshEyesWanted');
    },
    computed: {
      eyeswanted() {
        const eyeswanted = this.$store.state.eyeswanted || [];
        return eyeswanted;
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
  </style>
  