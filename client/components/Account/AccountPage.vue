<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account management for {{ $store.state.firstname }} {{ $store.state.lastname }}</h2>
      </header>
      <LogoutForm />
      <router-link to="/accountsettings">
        <h3> Account Settings </h3>
      </router-link>
    </section>
  </main>
</template>

<script>
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    LogoutForm
  }
};
</script>
