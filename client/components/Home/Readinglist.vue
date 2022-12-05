<template>
    <main>
      <h1>
        Reading List
      </h1>
      <section
        v-for="teammate in eyeswanted.author"
        class="user-updates"
      >
        <h2>{{ teammate }}</h2>
        <template v-for="eyeswanted in (eyeswanted[teammate] || [])">
          <UpdatePreview :update="eyeswanted" />
        </template>
        <p v-if="!eyeswanted">
          No eyes wanted updates now.
        </p>
      </section>
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
        const groupedUpdates = eyeswanted.reduce((groups, u) => {
          if (!groups[u.author.email]) {
            groups[u.author.email] = [];
          }
          groups[u.author.email].push(u);
          return groups;
        }, {});
        return groupedUpdates;
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
  