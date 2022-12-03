<script>

// Mixin for getting the project specified in the URL and redirecting if it
// does not exist.
export default {
  name: 'GetCurrentProject',
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
}
</script>