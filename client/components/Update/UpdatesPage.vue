<template>
  <div class="container">
    <UpdateSidebar :project="project"/>
    <main :class="{thin: $store.state.currentUpdate}">
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

main {
  margin: 0 0 0 17%;
  display: inline-block;
  transition: width 1ms ease-in-out;
  background-color: #fff;
  padding-right: 20px;
}
main.thin {
  width: 50%;
}
.details-container {
  display: inline-block;
  position: fixed;
  top: 0;
  right: 0;
  background-color: #f8f8f8;
  border-left: 2px solid #a4a4a4;
  width: 17%;
  height: 100%;
  margin-left: 8px;
  padding: 40px 36px;
}

.details-container > button {
  position: absolute;
  top: 16px;
  right: 16px;
  text-decoration: underline;
}
main.thin + .details-container {
  width: 33%;
}

</style>
