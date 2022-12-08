<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <header>
          <h2>Account settings for {{ $store.state.firstname }} {{ $store.state.lastname }}</h2>
        </header>
        
        <EditProfileForm />
      </section>
      <section>

        <DeleteAccountForm />
      </section>
    </main>
  </template>
  
  <script>
  import EditProfileForm from '@/components/Account/EditProfileForm.vue';
  import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
  import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
  import LogoutForm from '@/components/Account/LogoutForm.vue';
  
  export default {
    name: 'AccountSettingsPage',
    components: {
      EditProfileForm,
      ChangePasswordForm,
      DeleteAccountForm,
      LogoutForm
    }
  };
  </script>
  