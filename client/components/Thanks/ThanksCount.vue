<template>
  <div
    v-if="update.author.email === $store.state.email && thanks.length !== 0"
    class="thanks-container"
  >
    <p class="thanks-number">
      {{ thanks.length }} teammates thanked you!
      ({{ thanks.join(', ') }})
    </p>
  </div>
</template>
<script>
export default {
  name: 'ThanksCount',
  props: {
    update: {
      type: Object,
      required: true,
    },
  },
  computed: {
    thanks() {
      const thanks = this.$store.state.allthanks[this.update._id] || [];
      return thanks.map(t => `${t.postUser.firstName} ${t.postUser.lastName}`);
    }
  },
}
</script>

<style scoped>
.thanks-container p {
  font-size: 80%;
  color:rgb(125, 125, 125);
  margin-bottom: 0;
}
</style>