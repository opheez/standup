<template>
  <article class="update preview">
    <div>
      {{ update.dateModified }}: 
      {{ update.summary }}
    </div>
    <p class="update-status status" :class="statusToText[update.status]">
      {{ statusToText[update.status] }}
    </p>
  </article>
</template>

<script>
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