<script>
import UpdatesPage from '@/components/Update/UpdatesPage.vue';
export default {
  name: 'UserView',
  mixins: [UpdatesPage],
  computed: {
    updates() {
      const updates = this.$store.state.updates[this.$route.params.id] || [];
      let groupedUpdates = {};
      if (!this.$store.state.userFilter) {
        // Prefill with all participants
        groupedUpdates = this.project.participants.reduce(((groups, email) => {
            groups[email] = [];
            return groups;
        }), {});
      } else {
        // Otherwise prefill with the filtered for email
        groupedUpdates = {
            [this.$store.state.userFilter]: [],
        }
      }
      return updates.reduce((groups, u) => {
        if (u.author.email in groups) {
            groups[u.author.email].push(u);
        }
        return groups;
      }, groupedUpdates);
    }
  },
}
</script>