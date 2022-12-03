<template>
  <main>
    <h1>
      Project: {{ project.projectName }}
    </h1>
    <section
      v-for="teammate in project.participants"
      class="user-updates"
    >
      <h2>{{ teammate }}</h2>
      <template v-for="update in (updates[teammate] || [])">
        <UpdatePreview :update="update" />
      </template>
      <p v-if="!updates[teammate]">
        No updates have been shared.
      </p>
    </section>
  </main>
</template>

<script>
import UpdatePreview from '@/components/Update/UpdatePreview.vue';
import GetCurrentProject from '@/components/Update/GetCurrentProject.vue';

export default {
  name: 'UpdatesPage',
  mixins: [GetCurrentProject],
  components: {UpdatePreview},
  beforeMount() {
    this.$store.commit('refreshUpdates', this.$route.params.id);
  },
  computed: {
    updates() {
      const updates = this.$store.state.updates[this.$route.params.id] || [];
      const groupedUpdates = updates.reduce((groups, u) => {
        if (!groups[u.author]) {
          groups[u.author] = [];
        }
        groups[u.author].push(u);
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

</style>