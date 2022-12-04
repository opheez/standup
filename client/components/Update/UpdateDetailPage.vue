<template>
  <main>
    <h1>
      Project: {{ project.projectName }}
    </h1>
    <section class="update">
      <h2>
        {{ update.summary }}
      </h2>
      <p class="metadata">
        {{ update.author.firstName }} {{ update.author.lastName }} ({{ update.author.email }})
        <br></br>
        {{ update.dateModified }}
      </p>
      <p class="status" :class="statusToText[update.status]">
        {{ statusToText[update.status] }}
      </p>
      <h3>Details</h3>
      <p>
        {{ update.details }}
      </p>
      <div v-if="update.status === 'blocked'">
        <h3>Blockers</h3>
        <ul class="reset">
          <li
            v-for="blocker in update.blockers"
          >
            {{ bocker }}
          </li>
        </ul>
        <p v-if="!update.blockers.length">No blockers were specified.</p>
      </div>
      <div v-if="update.status === 'inprogress'">
        <h3>To-Dos</h3>
        <ul class="reset">
          <li
            v-for="todo in update.todos"
          >
            {{ todo }}
          </li>
        </ul>
        <p v-if="!update.todos.length">No to-dos were specified.</p>
      </div>
    </section>
  </main>
</template>
<script>
export default {
  name: 'UpdateDetailPage',
  methods: {
    findFields(projectId, updateId) {
      if (!(projectId in this.$store.state.updates)) {
        return null;
      }
      const project = this.$store.state.projects.find(
          proj => proj._id === projectId);
      const update = (this.$store.state.updates[projectId] || []).find(
          u => u._id === updateId);
      console.log(projectId, updateId, project, update)
      return {project, update};
    },
    // Redirect if the corresponding update does not exist
    verifyUpdate() {
      if (!this.update) {
        this.$router.push({name: 'Not Found'});
      }
    },
  },
  data() {
    const {project, update} = this.findFields(
        this.$route.params.projectId, this.$route.params.updateId);
    return {
      update,
      project,
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
    }
  },
  watch: {
    "$route.params": {
      handler: function(value) {
        const {projectId, updateId} = value;
        const {project, update} = this.findFields(
          projectId, updateId);
        this.project = project;
        this.update = update;
        this.verifyUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style scoped>
.update ul.reset,
.update ul.reset li {
  list-style-type: disc;
}

.update ul.reset {
  padding-left: 24px;
}


</style>