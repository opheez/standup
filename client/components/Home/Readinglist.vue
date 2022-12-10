<template>
  <div>
    <h1>
      Reading List
    </h1>
    <UpdatePreview
      v-for="eyeswanted in $store.state.eyeswanted"
      :update="eyeswanted.update"
      :openUpdate="openUpdate"
    />
    <article v-if="Object.keys($store.state.eyeswanted).length===0">
      <p> No eyes wanted updates. </p>
    </article>
  </div>
</template>
  
  <script>
  import UpdatePreview from '@/components/Update/UpdatePreview.vue';
  
  export default {
    name: 'ReadingList',
    components: {UpdatePreview},
    props: {
      openUpdate: {
        type: Function,
        required: true,
      }
    },
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

  .readingList{
    height: 20em;
    overflow: auto;
  }
  </style>
  