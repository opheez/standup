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
      <div class="field">
        <label>Action Items</label>
        <div class="items-container">
          <div v-for="(item, i) in fields.actionItems" class="item">
            ●
            <input
              placeholder="Look into..."
              :id="i"
              :value="fields.actionItems[i]"
              @input="fields.actionItems[i] = $event.target.value"
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
      <button type="submit" @click="submit">Add Update</button>
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
        actionItems: [''],
      },
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
    };
  },
  methods: {
    removeItem(index) {
      this.fields.actionItems.splice(index, 1);
    },
    addItem(list) {
      this.fields.actionItems.push('');
    },
    async submit() {
      const body = {
        ...this.fields,
        projectId: this.$route.params.id,
      };
      console.log(body);
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify(body),
      };
      try {
        const res = await fetch('/api/updates', options);
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully shared update!',
        });
        this.$store.commit('refreshUpdates', this.$route.params.id);
        this.$router.push({
          name: 'Updates',
          params: {
            id: this.$route.params.id,
          }
        });  
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
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