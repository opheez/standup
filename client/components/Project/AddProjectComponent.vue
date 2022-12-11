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
          <TextInput
            :name="'name'"
            :maxLength="50"
            :placeholder="'Project Name'"
            :value="fields.name"
            :onChange="(value) => {fields.name = value}"
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
              <button
                class="text-btn"
                @click="$event.preventDefault(); removeCollaborator(i)"
              >
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
        <div class="field">
          <label for="tags">
            Define all possible update tags for your project
          </label>
          <div class="tags-list">
            <div
              v-for="(tag, i) in fields.tags"
              class="tag"
            >
              <input
                :id="i"
                :name="i"
                :value="fields.tags[i]"
                placeholder="Update tag"
                @input="fields.tags[i] = $event.target.value"
              />
              <button
                class="text-btn"
                @click="$event.preventDefault(); removeTag(i)"
              >
                🗑
              </button>
            </div>
            <button
              class="text-btn"
              @click="$event.preventDefault(); addTag()"
            >
              + Add a tag
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
import TextInput from '@/components/common/TextInput.vue';

export default {
  name: 'AddProjectComponent',
  components: {Modal, TextInput},
  data() {
    return {
      show: false,
      minDate: moment().format('YYYY-MM-DD'),
      fields: {
        name: '',
        deadline: '',
        collaborators: [''],
        tags: [''],
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
    async submit() {
      console.log(this.fields.deadline);
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          projectName: this.fields.name,
          scheduledUpdates: [this.fields.deadline],
          invitedUsers: this.fields.collaborators,
          tags: this.fields.tags
        }),
      };
      try {
        const res = await fetch('/api/projects', options);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully created project!',
        });
        this.$store.commit('refreshInvites');
        this.$store.commit('refreshProjects');
        this.hideModal();
        this.fields = {
          name: '',
          deadline: '',
          collaborators: [''],
          tags: [''],
        };
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
    },
    addCollaborator() {
      this.fields.collaborators.push('');
    },
    removeCollaborator(i) {
      this.fields.collaborators.splice(i, 1);
    },
    addTag() {
      this.fields.tags.push('');
    },
    removeTag(i) {
      this.fields.tags.splice(i, 1);
    },
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
.collaborators-list, .tags-list {
  padding: 12px 16px;
  border: 1px solid #555;
  background-color: #fff;
}

.collaborators-list > .text-btn , .tags-list > .text-btn {
  text-decoration: underline;
  transition: all 0.2ms ease-in-out;
}
.collaborators-list > .text-btn:hover, .tags-list > .text-btn:hover {
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