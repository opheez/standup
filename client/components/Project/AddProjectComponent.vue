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
        <div class="field required" :class="{error: errors.name}">
          <label for="project-name">
            Name
          </label>
          <TextInput
            :error="!!errors.name"
            :name="'name'"
            :maxLength="50"
            :placeholder="'Project Name'"
            :value="fields.name"
            :onChange="(value) => {fields.name = value}"
            :onBlur="validateName"
          />
          <p v-if="errors.name" class="error-message">
            {{ errors.name }}
          </p>
        </div>
        <div class="field required" :class="{error: errors.deadline}">
          <label for="project-deadline">
            Deadline
          </label>
          <input
            id="name"
            name="name"
            type="date"
            :class="{error: errors.deadline}"
            :min="minDate"
            :value="fields.deadline"
            @input="fields.deadline = $event.target.value"
            @blur="validateDeadline($event.target.value)"
          />
          <p v-if="errors.deadline" class="error-message">
            {{ errors.deadline }}
          </p>
        </div>
        <div
          class="field required"
          :class="{error: hasCollaboratorErrors }">
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
                :class="{error: errors.collaborators[i]}"
                placeholder="john.doe@gmail.com"
                @input="onCollaboratorChange($event.target.value, i)"
                @blur="validateCollaborators($event.target.value, i)"
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
          <p v-if="hasMissingCollaboratorsErrors" class="error-message">
            Please enter at least one collaborator.
          </p>
          <p v-if="hasCollaboratorValueErrors" class="error-message">
            Email addresses must be of the format someone@domain
          </p>
          <p v-if="hasDupeCollaboratorsErrors" class="error-message">
            Please enter each collaborator only once
          </p>
          <p v-if="hasSelfCollaboratorErrors" class="error-message">
            Please do not invite yourself to the project. Creators are added by default.
          </p>
        </div>
        <div class="field" :class="{error: hasTagErrors}">
          <label for="tags">
            Define all possible update tags for your project
          </label>
          <div class="tags-list">
            <div
              v-for="(tag, i) in fields.tags"
              class="tag"
            >
              <TextInput
                :error="errors.tags[i]"
                :name="'tag'"
                :maxLength="20"
                :placeholder="'Update tags'"
                :value="fields.tags[i]"
                :onChange="(value) => onTagChange(value, i)"
                :onBlur="(value) => validateTags(value, i)"
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
          <p v-if="hasTagErrors" class="error-message">
            Tags cannot be empty
          </p>
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
      errors: {
        tags: [false],
        collaborators: [false],
      }
    }
  },
  methods: {
    hideModal() {
      this.show = false;
    },
    showModal() {
      this.show = true;
    },
    validateName(value) {
      if (value.trim().length === 0) {
        this.$set(this.errors, 'name', 'Project name is a required field');
      } else {
        this.$delete(this.errors, 'name');
      }
    },
    validateDeadline(value) {
      if (value.trim().length === 0) {
        this.$set(this.errors, 'deadline', 'Deadline is a required field');
      } else {
        this.$delete(this.errors, 'deadline');
      }
    },
    validateTags(value, idx) {
      this.$set(this.errors.tags, idx, value.trim().length === 0);
    },
    validateCollaborators(value, idx) {
      const emailRegex = /^^\S+@.+\..+$/i;
      this.$set(this.errors.collaborators, idx, !emailRegex.test(value));
    },
    async submit() {
      if (this.validateForm()) {
        this.$store.commit('alert', {
          status: 'error',
          message: 'Please fix form errors before submitting',
        });
        return;
      }
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
        this.errors = {
          collaborators: [false],
          tags: [false],
        }
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
    },
    addCollaborator() {
      this.fields.collaborators.push('');
      this.errors.collaborators.push(false);
    },
    removeCollaborator(i) {
      this.fields.collaborators.splice(i, 1);
      this.errors.collaborators.splice(i, 1);
    },
    onCollaboratorChange(value, i) {
      this.$set(this.fields.collaborators, i, value);
    },
    addTag() {
      this.fields.tags.push('');
      this.errors.tags.push(false);
    },
    removeTag(i) {
      this.fields.tags.splice(i, 1);
      this.errors.tags.splice(i, 1);
    },
    onTagChange(value, idx) {
      this.$set(this.fields.tags, idx, value);
    },
    validateForm() {
      // Validate all fields again because inputs aren't flagged
      // until an attempt to edit it
      this.fields.collaborators.forEach((val, i) =>
          this.validateCollaborators(val, i));
      this.fields.tags.forEach((val, i) =>
          this.validateTags(val, i));
      this.validateName(this.fields.name);
      this.validateDeadline(this.fields.deadline);
      return this.hasErrors;
    },
  },
  computed: {
    hasCollaboratorValueErrors() {
      return this.errors.collaborators.some(e => e);
    },
    hasMissingCollaboratorsErrors() {
      return this.fields.collaborators.length === 0;
    },
    hasDupeCollaboratorsErrors() {
      return new Set(this.fields.collaborators).size !== this.fields.collaborators.length;
    },
    hasSelfCollaboratorErrors() {
      return this.fields.collaborators.find((email) => email === this.$store.state.email);
    },
    hasCollaboratorErrors() {
      return this.hasCollaboratorValueErrors
          || this.hasMissingCollaboratorsErrors
          || this.hasDupeCollaboratorsErrors
          || this.hasSelfCollaboratorErrors;
    },
    hasTagErrors() {
      return this.errors.tags.some(e => e);
    },
    hasErrors() {
      return Object.keys(this.errors).length > 2 || this.hasTagErrors || this.hasCollaboratorErrors;
    }
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 12px;
}
.field > input {
  width: 100%;
}
.field > label {
  font-weight: bold;
  margin-bottom: 4px;
}
.field.required > label:after {
  color: #ca0000;
  content: '*';
  display:inline;
  font-weight: bold;
}
.field.error {
  border-left: 3px solid #ca0000;
  padding-left: 8px;
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
  margin-bottom: 4px;
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

.tag {
  display: flex;
  align-items: flex-start;
  margin-bottom: 4px;
}
</style>