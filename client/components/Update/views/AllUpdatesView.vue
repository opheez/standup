<script>
import UpdatesPage from '@/components/Update/UpdatesPage.vue';
export default {
  name: 'AllUpdatesView',
  mixins: [UpdatesPage],
  computed: {
    updates() {
      return {
        'All updates': this.$store.state.updates[this.$route.params.id] || []
      };
    }
  },
}
</script>