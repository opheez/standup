<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'email', label: 'Email', value: this.$store.state.email},
        {id: 'firstName', label: 'First name', value: this.$store.state.firstname},
        {id: 'lastName', label: 'Last name', value: this.$store.state.lastname},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Update profile',
      callback: () => {
        const message = 'Successfully updated your profile!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
