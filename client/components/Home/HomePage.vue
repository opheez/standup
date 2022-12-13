<template>
  <div v-if="$store.state.email">
    <main class="left-panel" :class="{thin: $store.state.currentUpdate}">
      <ReadingList :openUpdate="openUpdate"/>
      <ProjectDashboard/>
    </main>
    <div class="details-container" v-show="$store.state.currentUpdate">
      <button @click="hideUpdate" class="text-btn thin-btn">
        Hide >
      </button>
      <UpdateDetailPage
        v-if="$store.state.currentUpdate"
        class="update-details"
        :showProjectTitle="true"
        :project="$store.state.projects.find(p => p._id === $store.state.currentUpdate.projectId)"
        :update="$store.state.currentUpdate"
      />
    </div>
  </div>
  <main class="home" v-else>
    <h2>Welcome to Standup!</h2>
    <h3>A team project management application for students</h3>
    <article v-if="showCreate">
      <RegisterForm/>
      <p>
        Already have an account?
        <a @click="showCreate = false">
          Sign in
        </a>
      </p>
    </article>
    <article v-else>
      <LoginForm/>
      <p>
        New to Standup?
        <a @click="showCreate = true">
          Create an account
        </a>
      </p>
    </article>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';
import ReadingList from '@/components/Home/Readinglist.vue';
import ProjectDashboard from '@/components/Project/ProjectDashboard.vue';
import UpdateDetailPage from '@/components/Update/UpdateDetailPage.vue';

export default {
  name: 'HomePage',
  components: {
    RegisterForm,
    LoginForm,
    ReadingList,
    ProjectDashboard,
    UpdateDetailPage,
  },
  data() {
    return {
      // whether to show the create acc or login form
      showCreate: false,
    };
  },
  methods: {
    openUpdate(update) {
      if (update === this.$store.state.currentUpdate) {
        this.$store.commit('setCurrentUpdate', null);  
        return;
      }
      this.$store.commit('setCurrentUpdate', update);
    },
    hideUpdate() {
      this.$store.commit('setCurrentUpdate', null);
    }
  },
}
</script>

<style scoped>
p > a {
  cursor: pointer;
  color: indigo;
}

main.left-panel {
  padding-right: 0;
}
main.left-panel.thin {
  padding-right: 20px;
}
</style>