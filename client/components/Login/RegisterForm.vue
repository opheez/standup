<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setEmail: true,
      fields: [
        {id: 'email', label: 'Email', value: ''},
        {id: 'firstName', label: 'First name', value: ''},
        {id: 'lastName', label: 'Last name', value: ''},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Create account',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Feed'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
