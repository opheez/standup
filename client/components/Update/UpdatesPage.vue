<template>
  <main>
    <h1>
      Project: {{ project.projectName }}
    </h1>
    <section
      v-for="(updateList, key) in updates"
      class="user-updates"
    >
      <h2>{{ key }}</h2>
      <template v-for="update in updateList">
        <UpdatePreview :update="update" />
      </template>
      <p v-if="!updateList.length">
        No updates have been shared.
      </p>
    </section>
    <button
      v-if="project.active"
      class="add-update-btn"
      @click="goToAddForm"
    >+ Add Update</button>
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
  methods: {
    goToAddForm() {
      this.$router.push({
        name: 'AddUpdate',
        params: {
          id: this.project._id, 
        }
      });
    },
  }
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
