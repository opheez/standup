<template>
  <div class="container">
    <UpdateSidebar :project="project"/>
    <main class="left-panel" :class="{thin: $store.state.currentUpdate}">
      <h1>
        Project: {{ project.projectName }}
      </h1>
      <button
        v-if="project.active"
        class="add-update-btn"
        @click="goToAddForm"
      >+ Add Update</button>
      <section
        v-for="(updateList, key) in updates"
        class="user-updates"
      >
        <h2>{{ key }}</h2>
        <template v-for="update in updateList">
          <UpdatePreview :update="update" :openUpdate="openUpdate"/>
        </template>
        <p v-if="!updateList.length">
          No updates have been shared.
        </p>
      </section>
    </main>
    <div class="details-container" v-show="$store.state.currentUpdate">
      <button @click="hideUpdate" class="text-btn thin-btn">
        Hide >
      </button>
      <UpdateDetailPage
        v-if="$store.state.currentUpdate"
        class="update-details"
        :project="project"
        :update="$store.state.currentUpdate"
      />
    </div>
  </div>
</template>

<script>
import UpdatePreview from '@/components/Update/UpdatePreview.vue';
import UpdateDetailPage from '@/components/Update/UpdateDetailPage.vue';
import GetCurrentProject from '@/components/Update/GetCurrentProject.vue';
import UpdateSidebar from '@/components/Update/UpdateSidebar.vue';

export default {
  name: 'UpdatesPage',
  mixins: [GetCurrentProject],
  components: {UpdatePreview, UpdateSidebar, UpdateDetailPage},
  data() {
    return {
      currentUpdate: null,
    }
  },
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
    openUpdate(update) {
      if (update === this.$store.state.currentUpdate) {
        this.hideUpdate();
      } else {
        this.$store.commit('setCurrentUpdate', update);
      }
    },
    hideUpdate(update) {
      this.$store.commit('setCurrentUpdate', null);
    }
  },
  computed: {
    updates() {
      return {};
    }
  }
}
</script>

<style scoped>
.user-updates {
  padding-bottom: 8px;
}
.container {
  position: relative;
  display: flex;
}

.container header {
  display: flex;
  align-items: center;
}
.container header h1 {
  flex-grow: 1;
}


</style>
