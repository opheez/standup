<template>
  <article class="update preview" @click="openUpdate">
    <div>
      {{ update.dateModified }}: 
      {{ update.summary }}
    </div>
    <p class="update-status status" :class="statusToText[update.status]">
      {{ statusToText[update.status] }}
    </p>
    <div
        v-if="(this.update.author.email === $store.state.email && isThankedby())">
        <p class="thanks-number">
        {{ this.thanks.length }} thanks </p>
        <p v-for="thanks in this.thanks"
        class="thanks-number">
          by {{ thanks.postUser.firstName }} {{thanks.postUser.lastName}}
        </p>
      </div>
  </article>
</template>

<script>
import AddEyesWantedComponent from '@/components/EyesWanted/AddEyesWanted.vue';
export default {
  name: 'UpdatePreview',
  props: {
    update: {
      type: Object,
      required: true,
    },
  },
  data()  {
    return {
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
    }
  },

  methods: {
    isThankedby() {
      const allthanks = this.$store.state.allthanks;
      this.thanks = allthanks.filter(thanks => thanks.updateId._id === this.update._id);
      return this.thanks;
    },
    openUpdate() {
      this.$router.push({
        name: 'UpdateDetails',
        params: {
          id: this.$route.params.id,
          updateId: this.update._id,
        },
      })
    }
  }
}
</script>

<style scoped>
.update {
  margin-bottom: 16px;
}

.update > p {
  margin: 0;
}

.update > div + p {
  margin-top: 8px;
}
.update-status.Blocked {
  background-color: #F58870;
}

.thanks-number {
  font-size: 80%;
  color:rgb(125, 125, 125);
}
</style>