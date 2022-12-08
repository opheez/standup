<template>
  <div v-if="$store.state.email">
    <ReadingList/>
    <ProjectDashboard/>
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

export default {
  name: 'HomePage',
  components: {
    RegisterForm,
    LoginForm,
    ReadingList,
    ProjectDashboard
  },
  data() {
    return {
      // whether to show the create acc or login form
      showCreate: false,
    };
  },
}
</script>

<style>
p > a {
  cursor: pointer;
  color: indigo;
}
</style>