<script>
import UpdatesPage from '@/components/Update/UpdatesPage.vue';
export default {
  name: 'UserView',
  mixins: [UpdatesPage],
  computed: {
    updates() {
      const updates = this.$store.state.updates[this.$route.params.id] || [];
      const groupedUpdates = this.project.participants.reduce(((groups, email) => {
        groups[email] = [];
        return groups;
      }), {});
      return updates.reduce((groups, u) => {
        if (!groups[u.author.email]) {
          groups[u.author.email] = [];
        }
        groups[u.author.email].push(u);
        return groups;
      }, groupedUpdates);
    }
  },
}
</script>