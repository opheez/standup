<template>
  <div class="project preview" @click="openProject">
    <h3>{{ project.name }}</h3>
    <p class="deadline">Due {{ project.deadline }}</p>
    <ul class="reset teammates-list">
      <li v-for="teammate in project.teammates">
        {{ teammate }}
      </li>
    </ul>
    <div
      class="project-status status"
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
      if (!this.project.active) {
        return 'Completed';
      }
      if (moment() > moment(this.project.deadline)) {
        return 'Overdue';
      }
      return 'In-Progress';
    }
  },
  methods: {
    openProject() {
      this.$router.push({
        name: 'Updates',
        params: {
          id: this.project.id,
        },
      });
    }
  },
}
</script>

<style scoped>
.project {
  display: inline-flex;
  flex-direction: column;
  width: 340px;
  height: 260px;
  margin: 0 12px 12px 0;
  cursor: pointer;
}

.project:hover {
  background: #f0eef0;
}
.project > h3 {
  margin: 0;
}

.project > .deadline {
  margin-top: 4px;
}
.project > .deadline,
.project > .teammates-list {
  margin-bottom: 16px;
}

.project > .teammates-list {
  flex-grow: 1;
  overflow-y: scroll;
}
.project > .teammates-list li {
  margin-bottom: 4px;
}
.project-status.Overdue {
  background: #F58870;
}


</style>