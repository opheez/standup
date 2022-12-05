<template>
  <article class="update preview" @click="openUpdate">
    <div>
      {{ update.dateModified }}: 
      {{ update.summary }}
    </div>
    <p class="update-status status" :class="statusToText[update.status]">
      {{ statusToText[update.status] }}
    </p>
    <p
      v-if="this.update.author.email === $store.state.email"
      class="thanks-number">
      {{ existingThanks() }} thanks
    </p>
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
    existingThanks() {
        /**
         * Return if user has liked freet
         */
        const allThanks = this.$store.state.allthanks;
        const exists = allThanks
                        .filter(thanks => thanks.updateId._id === this.update._id)
                        .length;
        return exists;
      },
    openUpdate() {
      this.$router.push({
        name: 'UpdateDetails',
        params: {
          projectId: this.update.projectId,
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
</style>