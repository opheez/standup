<template>
  <main>
    <h1>Group Projects</h1>
    <section>
      <ProjectComponent
        v-for="project in $store.state.projects"
        :key="project.id"
        :project="project"
      />
    </section>
  </main>
</template>

<script>
import ProjectComponent from '@/components/Project/ProjectComponent.vue';

export default {
  name: 'ProjectDashboard',
  components: {ProjectComponent},
  beforeMount() {
    this.$store.commit('refreshProjects');
  },
};
</script>