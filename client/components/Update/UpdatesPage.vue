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
    <button class="add-update-btn" @click="goToAddForm">+ Add Update</button>
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