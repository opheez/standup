<template>
  <div>
    <button class="add-btn" @click="showModal">
      + Add Project
    </button>
    <Modal
      v-show="show"
      :hideModal="hideModal"
    >
      <h2>Add Project</h2>
      <form @submit.prevent="submit">
        <div class="field">
          <label for="project-name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="6.1040 Final Project"
            :value="fields.name"
            @input="fields.name = $event.target.value"
          />
        </div>
        <div class="field">
          <label for="project-name">
            Deadline
          </label>
          <input
            id="name"
            name="name"
            type="date"
            :min="minDate"
            :value="fields.deadline"
            @input="fields.deadline = $event.target.value"
          />
        </div>
        <div class="field">
          <label for="collaborators">
            Collaborators
          </label>
          <div class="collaborators-list">
            <div
              v-for="(collaborator, i) in fields.collaborators"
              class="collaborator"
            >
              <label>
                ({{i + 1}})
              </label>
              <input
                :id="i"
                :name="i"
                :value="fields.collaborators[i]"
                placeholder="john.doe@gmail.com"
                @input="fields.collaborators[i] = $event.target.value"
              />
              <button class="text-btn" @click="removeCollaborator(i)">
                🗑
              </button>
            </div>
            <button
              class="text-btn"
              @click="$event.preventDefault(); addCollaborator()"
            >
              + Add collaborator
            </button>
          </div>
        </div>
      </form>
      <div class="actions">
        <button class="invert" @click="hideModal">Cancel</button>
        <button type="submit" @click="submit">Add</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import moment from 'moment';
import Modal from '@/components/common/Modal.vue';

export default {
  name: 'AddProjectComponent',
  components: {Modal},
  data() {
    return {
      show: false,
      minDate: moment().format('YYYY-MM-DD'),
      fields: {
        name: '',
        deadline: '',
        collaborators: [''],
      },
    }
  },
  methods: {
    hideModal() {
      this.show = false;
    },
    showModal() {
      this.show = true;
    },
    submit() {
      console.log(this.fields);
      this.hideModal();
    },
    addCollaborator() {
      this.fields.collaborators.push('');
    },
    removeCollaborator(i) {
      this.fields.collaborators.splice(i, 1);
    }
  },
}
</script>

<style scoped>
.field {
  margin-bottom: 12px;
}
.field > input {
  width: 100%;
}
.collaborators-list {
  padding: 12px 16px;
  border: 1px solid #555;
  background-color: #fff;
}

.collaborators-list > .text-btn {
  text-decoration: underline;
  transition: all 0.2ms ease-in-out;
}
.collaborators-list > .text-btn:hover {
  color: rgb(91, 60, 128);
}
.collaborator {
  display: flex;
  align-items: center;
}
.collaborator > label {
  margin-right: 8px;
}
.collaborator > input {
  flex-grow: 1;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
</style>