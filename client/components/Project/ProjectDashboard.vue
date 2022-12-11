<template>
  <div>
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
      <ProjectInvitesComponent/>
      <AddProjectComponent/>
    </div>
    <section>
      <p v-if="filteredProjects.length === 0">No projects found.</p>
      <ProjectComponent
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </section>
  </div>
</template>

<script>
import ProjectComponent from '@/components/Project/ProjectComponent.vue';
import AddProjectComponent from '@/components/Project/AddProjectComponent.vue';
import ProjectInvitesComponent from '@/components/Project/ProjectInvitesComponent.vue';

const FILTER_TO_VALUE = {
  'All': null,
  'Active': true,
  'Completed': false,
}

export default {
  name: 'ProjectDashboard',
  components: {ProjectComponent, AddProjectComponent, ProjectInvitesComponent,},
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
      const allProjects = this.$store.state.projects;
      return allProjects.filter(project => {
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
  margin: 0 8px 0 0;
  cursor: pointer;
  color: rgb(48, 48, 48);
}
.project-filters > p.active {
  color: rgb(73, 40, 183);
  text-decoration: underline;
}

.add-btns {
  display: flex;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}
.add-btns > * + * {
  margin-left: 12px;
}
</style>