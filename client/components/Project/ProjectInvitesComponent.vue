<template>
  <div class="invite-container">
    <button @click="showModal">
      Project Invites
    </button>
    <Modal
      v-if="show"
      :hideModal="hideModal"
    >
      <h2>Pending Invitations</h2>
      <div v-for="invite in $store.state.invites">
        {{invite.name}}
      </div>
      <button
        class="close-modal-btn text-btn"
        @click="hideModal"
      >
        X
      </button>
    </Modal>
  </div>
</template>
  
<script>
import Modal from '@/components/common/Modal.vue';

export default {
  name: 'AddProjectComponent',
  components: {Modal},
  beforeMount() {
    this.$store.commit('refreshInvites');
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    hideModal() {
      this.show = false;
    },
    showModal() {
      this.show = true;
    },
  },
}
</script>

<style scoped>
.close-modal-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-weight: 700;
}
.invite-container {
  max-height: 90vh;
}
</style>