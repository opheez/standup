<template>
  <div class="project" @click="openProject">
    <h3>{{ project.name }}</h3>
    <p class="deadline">Due {{ project.deadline }}</p>
    <ul class="reset teammates-list">
      <li v-for="teammate in project.teammates">
        {{ teammate }}
      </li>
    </ul>
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
  border: 2px solid #a4a4a4;
  border-radius: 12px;
  display: inline-flex;
  flex-direction: column;
  background: #F8F8F8;
  width: 340px;
  height: 260px;
  margin: 0 12px 12px 0;
  padding: 24px;
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