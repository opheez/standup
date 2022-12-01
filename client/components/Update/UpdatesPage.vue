<template>
  <main>
    <h1>
      Project: {{ project.name }}
    </h1>
    <section
      v-for="teammate in project.teammates"
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

export default {
  name: 'UpdatesPage',
  components: {UpdatePreview},
  methods: {
    findProject(id) {
      return this.$store.state.projects.find(
          proj => proj.id === id);
    },
    // Redirect if the corresponding project does not exist
    verifyProject() {
      if (!this.project) {
        this.$router.push({name: 'Not Found'});
      }
    },
  },
  beforeMount() {
    this.verifyProject();
    this.$store.commit('refreshUpdates', this.$route.params.id);
  },
  data() {
    return {
      project: this.findProject(this.$route.params.id),
    }
  },
  watch: {
    "$route.params.id": {
      handler: function(value) {
        this.project = this.findProject(value);
        this.verifyProject();
      },
      deep: true,
    },
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
      console.log('computed updates', groupedUpdates);
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