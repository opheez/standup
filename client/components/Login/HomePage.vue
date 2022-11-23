<template>
  <main class="home">
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

export default {
  name: 'HomePage',
  components: {
    RegisterForm,
    LoginForm
  },
  data() {
    return {
      // whether to show the create acc or login form
      showCreate: true,
    };
  },
  beforeCreate() {
    if (this.$store.state.username) {
      this.$router.push({ name: 'Feed' });
    }
  },
}
</script>

<style>
p > a {
  cursor: pointer;
  color: indigo;
}
</style>