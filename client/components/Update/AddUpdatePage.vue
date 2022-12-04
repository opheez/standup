<template>
  <main>
    <h1>
      Project: {{ project.projectName }}
    </h1>
    <section>
      <h2>
        Add update form
      </h2>
      <div class="field">
        <label for="summary">
          Summary
        </label>
        <input
          name="summary"
          placeholder="Implemented the backend for..."
          :value="fields.summary"
          @input="fields.summary = $event.target.value"
        />
      </div>
      <div class="field">
        <label for="details">
          Details
        </label>
        <textarea
          name="details"
          placeholder="Broke the task up into..."
          :value="fields.details"
          @input="fields.details = $event.target.value"
        ></textarea>
      </div>
      <div class="field">
        <label for="details">
          Status
        </label>
        <div class="field status-options">
          <div v-for="(text, value) in statusToText" class="status-option">
            <input
              type="radio"
              name="status"
              :value="value"
              :checked="fields.status === value"
              @input="fields.status = $event.target.value"
            />
            <label
              class="status"
              :for="value"
              :class="text"
              @click="fields.status = value"
            >{{ text }}
            </label>
          </div>
        </div>
      </div>
      <div v-if="(fields.status in statusToListLabel)" class="field">
        <label>{{statusToListLabel[fields.status]}}</label>
        <div class="items-container">
          <div v-for="(item, i) in listField" class="item">
            ●
            <input
              :id="i"
              :value="listField[i]"
              @input="listField[i] = $event.target.value"
            />
            <button
              class="text-btn"
              @click="$event.preventDefault(); removeItem(i)"
            >
              🗑
            </button>
          </div>
        </div>
        <button
          class="text-btn"
          @click="$event.preventDefault(); addItem()"
        >
          + Add item
        </button>
      </div>
      <button type="submit">Add Update</button>
    </section>
  </main>
</template>

<script>
import GetCurrentProject from '@/components/Update/GetCurrentProject.vue';

export default {
  name: 'AddUpdatePage',
  mixins: [GetCurrentProject],
  data() {
    return {
      fields: {
        summary: '',
        details: '',
        status: 'inprogress',
        todos: [''],
        blockers: [''],
      },
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
      statusToListLabel: {
        'inprogress': 'To-Dos',
        'blocked': 'Blockers',
      },
    };
  },
  computed: {
    listField() {
      switch (this.fields.status) {
        case 'inprogress':
          return this.fields.todos;
        case 'blocked':
          return this.fields.blockers;
        default:
          return [];
      }
    }
  },
  methods: {
    removeItem(index) {
      this.listField.splice(index, 1);
    },
    addItem(list) {
      this.listField.push('');
    }
  }
}
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

.field {
  margin-bottom: 12px;
}
.field > textarea,
.field > input {
  width: 100%;
  margin-top: 4px;
}

.field > textarea {
  min-height: 100px;
}

.status-option {
  display: inline-block;
  margin-right: 12px;
}
.status-option input {
  margin-right: 4px;
}

.status-options {
  padding: 8px 0;
}
.status.Blocked {
  background: #F58870;
}

.item {
  display: flex;
  align-items: center;
}

.item > input {
  flex-grow: 1;
  margin-left: 8px;
}

button[type="submit"] {
  align-self: flex-end;
}
</style>