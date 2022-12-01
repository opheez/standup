<template>
  <div class="project">
    <h3>{{ project.name }}</h3>
    <p class="deadline">Due {{ project.deadline }}</p>
    <div class="teammates-list">
      <p v-for="teammate in project.teammates">
        {{ teammate }}
      </p>
    </div>
    <div
      class="project-status"
      :class="status"
    >
      {{ status }}
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ProjectComponent',
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  computed: {
    status() {
      if (this.project.active) {
        return 'Completed';
      }
      if (moment() > moment(this.project.deadline)) {
        return 'Overdue';
      }
      return 'In-Progress';
    }
  }
}
</script>

<style scoped>
.project {
  border: 2px solid #a4a4a4;
  border-radius: 12px;
  display: inline-block;
  background: #F8F8F8;
  width: 340px;
  margin: 0 12px 12px 0;
  padding: 24px;
}
.project > h3 {
  margin: 0;
}

.project-status {
  background: #bcbcbc;
  border-radius: 100px;
  padding: 4px 12px;
  width: fit-content;
}
.project-status.In-Progress {
  background: #FBC358;
}
.project-status.Completed {
  background: #69E8AB;
}
.project-status.Overdue {
  background: #F58870;
}
</style>