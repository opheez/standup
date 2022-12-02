<template>
  <article class="invite">
    <h4>
      {{ invite.name }}
    </h4>
    <p>Due: {{ invite.deadline }}</p>
    <label>Collaborators: </label>
    <ul class="reset">
      <li
        v-for="teammate in invite.teammates"
        class="teammate accepted"
      >
        ✔️ {{ teammate }}
      </li>
      <li
        v-for="teammate in invite.pendingRequests"
        class="teammate pending"
      >
        🕐 {{ teammate }}
      </li>
    </ul>
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
  methods: {
    declineInvite() {
      this.$delete(this.$store.state.invites, this.index);
    },
    acceptInvite() {
      this.$delete(this.$store.state.invites, this.index);
      this.$store.state.projects.push(this.invite);
    }
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