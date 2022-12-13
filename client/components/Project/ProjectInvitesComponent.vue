<template>
  <div>
    <button @click="showModal">
      Project Invites ({{ $store.state.invites ? $store.state.invites.length : 0 }})
    </button>
    <Modal
      v-if="show"
      :hideModal="hideModal"
    >
      <h2>Pending Invitations</h2>
      <div class="invite-list">
        <InviteComponent
          v-for="(invite, i) in $store.state.invites"
          :invite="invite"
          :index="i"
        />
      </div>
      <p v-if="!$store.state.invites.length">
        No pending project invitations.
      </p>
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
import InviteComponent from '@/components/Project/InviteComponent.vue';

export default {
  name: 'AddProjectComponent',
  components: {Modal, InviteComponent},
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

.invite-list {
  overflow-y: scroll;
}
</style>