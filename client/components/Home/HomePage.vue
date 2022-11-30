<template>
  <main class="home">
    <div v-if="$store.state.email">
      Reading List
    </div>
    <template v-else="$store.state.email">
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
    </template>
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
}
</script>

<style>
p > a {
  cursor: pointer;
  color: indigo;
}
</style>