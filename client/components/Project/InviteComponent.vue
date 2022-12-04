<template>
  <article class="invite">
    <h4>
      {{ invite.projectName }}
    </h4>
    <p>Due: {{ deadline }}</p>
    <p>Invited by: {{ invite.creator }}</p>
    <div class="action">
      <button class="decline-btn" @click="declineInvite">
        Decline
      </button>
      <button class="accept-btn" @click="acceptInvite">
        Accept
      </button>
    </div>
  </article>

</template>
<script>
export default {
  name: 'InviteComponent',
  props: {
    invite: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    }
  },
  computed: {
    deadline() {
      return this.invite.scheduledUpdates[this.invite.scheduledUpdates.length - 1]
    }
  },
  methods: {
    async respondToInvite(response, successCallback) {
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      };
      const url = `/api/projects/${this.invite._id}/${response}`;
      try {
        const res = await fetch(url, options);
        successCallback();
        this.$store.commit('refreshInvites');
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: `Failed to respond to ${this.invite.projectName}`,
        });
      }
    },
    async declineInvite() {
      this.respondToInvite('reject', () => {
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully declined invite',
        });
      });
    },
    async acceptInvite() {
      this.respondToInvite('accept', () => {
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully accepted invite',
        });
        this.$store.commit('refreshProjects');
      });
    },
  }
}
</script>

<style scoped>
.invite {
  background: #fff;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 12px 24px;
  margin-bottom: 12px;
}

.invite h4,
.invite p {
  margin: 4px 0;
}

.invite > ul {
  margin: 0 8px 12px 8px;
}

.invite li.accepted {
  color: #1e6d1e;
}

.action {
  display: flex;
  justify-content: space-between;
}

.action .accept-btn {
  background-color: #69E8AB;
}
.action .decline-btn {
  background-color: #F2A5A5;
}
</style>