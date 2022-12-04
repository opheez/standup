<template>
  <div class="project preview" @click.self="openProject">
    <h3>{{ project.projectName }}</h3>
    <p class="deadline">
      Due: {{ deadline }}
    </p>
    <ul class="reset teammates-list">
      <li v-for="teammate in project.participants">
        {{ teammate }}
      </li>
    </ul>
    <div
      class="project-status status"
      :class="status"
    >
      {{ status }}
    </div>
    <div class="edit-container">
      <dropdown-menu
        v-if="project.creator === $store.state.email"
        v-model="showEdit"
      >
        <button class="thin-btn invert edit">
            Edit
        </button>
        <div slot="dropdown">
          <button
            v-if="project.active"
            class="dropdown-item"
            href="#"
            @click="toggleActive"
          >Mark complete</button>
          <button
            class="dropdown-item"
            href="#"
            @click="markDelete"
          >Delete</button>
        </div>
      </dropdown-menu>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import DropdownMenu from '@innologica/vue-dropdown-menu';

export default {
  name: 'ProjectComponent',
  components: {DropdownMenu},
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEdit: false,
    }
  },
  computed: {
    deadline() {
      return this.project.scheduledUpdates[this.project.scheduledUpdates.length - 1];
    },
    status() {
      if (!this.project.active) {
        return 'Completed';
      }
      if (moment() > moment(this.deadline)) {
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
          id: this.project._id,
        },
      });
    },
    markDelete() {
      // TODO(AL): call backend when ready
      this.showEdit = false;
    },
    async toggleActive() {
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      };
      try {
        const res = await fetch(`/api/projects/${this.project._id}`, options);
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully marked inactive!',
        });
        this.$store.commit('refreshProjects');
        this.showEdit = false;
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
    }
  },
}
</script>

<style>
.project {
  display: inline-flex;
  flex-direction: column;
  width: 340px;
  height: 260px;
  margin: 0 12px 12px 0;
  cursor: pointer;
  position: relative;
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

.project:hover .edit-container {
  visibility: visible;
}
.edit-container {
  visibility: hidden;
  position: absolute;
  top: 12px;
  right: 12px;
}
.dropdown {
  position: relative;
} 
.dropdown-menu.show {
  display: block;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #555555;
  border-radius: 0.25rem;
} 
.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  text-decoration: none;
}
.dropdown-item:hover {
  background-color: rgba(0,0,0, 0.025);
}
</style>