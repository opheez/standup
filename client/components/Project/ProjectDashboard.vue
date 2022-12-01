<template>
  <main>
    <h1>Group Projects</h1>
    <div class="project-filters">
      <p
        v-for="(value, label) in FILTER_TO_VALUE"
        @click="activeFilter = value"
        class="filter"
        :class="{active: activeFilter === value}"
      >
        {{ label }}
      </p>
    </div>
    <div class="add-btns">
      <AddProjectComponent/>
    </div>
    <section>
      <ProjectComponent
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </section>
  </main>
</template>

<script>
import ProjectComponent from '@/components/Project/ProjectComponent.vue';
import AddProjectComponent from '@/components/Project/AddProjectComponent.vue';

const FILTER_TO_VALUE = {
  'All': null,
  'Active': true,
  'Completed': false,
}

export default {
  name: 'ProjectDashboard',
  components: {ProjectComponent, AddProjectComponent},
  data() {
    return {
      // filter on the status of the project. null means all projects are shown
      activeFilter: null,
    };
  },
  beforeMount() {
    this.$store.commit('refreshProjects');
  },
  created() {
    this.FILTER_TO_VALUE = FILTER_TO_VALUE;
  },
  computed: {
    filteredProjects() {
      return this.$store.state.projects.filter(project => {
        if (this.activeFilter === null) {
          return true;
        }
        if (this.activeFilter && project.active) {
          return true;
        }
        if (!this.activeFilter && !project.active) {
          return true;
        }
        return false;
      });
    }
  },
};
</script>
<style scoped>
.project-filters {
  display: flex;
  margin-bottom: 20px;
}
.project-filters > p {
  margin: 0 8px;
  cursor: pointer;
  color: rgb(48, 48, 48);
}
.project-filters > p.active {
  color: rgb(73, 40, 183);
  text-decoration: underline;
}

.add-btns {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>