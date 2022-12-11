<template>
  <section>
    <h2>
      <slot name="header"></slot>
    </h2>
    <div class="field required">
      <label for="summary">
        Summary
      </label>
      <TextInput
        :name="'summary'"
        :maxLength="60"
        :placeholder="'Implemented the backend for...'"
        :value="fields.summary"
        :onChange="(value) => {fields.summary = value}"
      />
    </div>
    <div class="field required">
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
      <label>{{ fields.status === 'completed' ? 'Next Steps' : 'Action Items'}}</label>
      <div class="items-container">
        <div v-for="(item, i) in fields.actionItems" class="item">
          ●
          <input
            placeholder="Look into..."
            :class="{error: errors[i]}"
            :id="i"
            :value="fields.actionItems[i]"
            @input="fields.actionItems[i] = $event.target.value"
            @blur="validate($event.target.value, i)"
          />
          <button
            class="text-btn"
            @click="$event.preventDefault(); removeItem(i)"
          >
            🗑
          </button>
        </div>
      </div>
      <p v-if="hasErrors" class="error">
        ⚠️ Action items cannot be empty
      </p>
      <button
        class="text-btn"
        @click="$event.preventDefault(); addItem()"
      >
        + Add item
      </button>
    </div>
    <div class="field">
      <label>Tags</label>
      <multiselect 
        v-model="fields.tags"
        :options="options"
        :multiple="true"
        :close-on-select="false">
      </multiselect>
    </div>
    <slot name="submit"></slot>
  </section>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect'
import TextInput from '@/components/common/TextInput.vue';

// register globally
Vue.component('multiselect', Multiselect)

export default {
  name: 'UpdateForm',
  components: {Multiselect, TextInput},
  props: {
    fields: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
      errors: this.fields.actionItems.map(i => null),
    };
  },
  methods: {
    removeItem(index) {
      this.fields.actionItems.splice(index, 1);
    },
    addItem(list) {
      this.fields.actionItems.push('');
    },
    validate(actionItem, i) {
      if (this.errors.length <= i) {
        for (let j = 0; j <= i - this.errors.length; ++j) {
          this.errors.push(null);
        }
      }
      if (!actionItem) {
        this.$set(this.errors, i, 'Cannot be left empty');
        return;
      }
      this.$set(this.errors, i, null);
    },
  },
  computed: {
    hasErrors() {
      return this.errors.some(error => error !== null);
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
section {
  display: flex;
  flex-direction: column;
  position: relative;
}

.field {
  margin-bottom: 12px;
}
.field > textarea,
.field > input {
  width: 100%;
  margin-top: 4px;
}
.field > label {
  font-weight: bold;
}
.field.required label:after {
  color: #8b0000;
  content: '*';
  display:inline;
  font-weight: bold;
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

.error {
  color: #8b0000;
  font-size: 80%;
  margin: 0 0 0 16px;
}
</style>