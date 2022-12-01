<template>
  <main>
    <h1>
      Project: {{ project.name }}
    </h1>
  </main>
</template>

<script>
export default {
  name: 'UpdatesPage',
  methods: {
    findProject(id) {
      return this.$store.state.projects.find(
          proj => proj.id === id);
    },
    verifyProject() {
      if (!this.project) {
        this.$router.push({name: 'Not Found'});
      }
    },
  },
  beforeMount() {
    this.verifyProject();
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
}
</script>