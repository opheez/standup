<template>
  <section>
    <h2>
      <slot name="header"></slot>
    </h2>
    <div class="field required" :class="{error: errors['summary']}">
      <label for="summary">
        Summary
      </label>
      <TextInput
        :error="!!errors['summary']"
        :name="'summary'"
        :maxLength="60"
        :placeholder="'Implemented the backend for...'"
        :value="fields.summary"
        :onChange="summaryOnChange"
        :onBlur="validateSummary"
      />
      <p v-if="errors['summary']" class="error-message">
        {{errors['summary']}}
      </p>
    </div>
    <div class="field required" :class="{error: errors['details']}">
      <label for="details">
        Details
      </label>
      <textarea
        name="details"
        placeholder="Broke the task up into..."
        :class="{error: errors['details']}"
        :value="fields.details"
        @input="fields.details = $event.target.value"
        @blur="validateDetails($event.target.value)"
      ></textarea>
      <p v-if="errors['details']" class="error-message">
        {{errors['details']}}
      </p>
    </div>
    <div class="field">
      <label for="status">
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
    <div class="field" :class="{error: hasActionItemErrors}">
      <label>{{ listLabel }}</label>
      <div class="items-container">
        <div v-for="(item, i) in fields.actionItems" class="item">
          ●
          <input
            placeholder="Look into..."
            :class="{error: errors.actionItems[i]}"
            :id="i"
            :value="fields.actionItems[i]"
            @input="fields.actionItems[i] = $event.target.value"
            @blur="validateActionItems($event.target.value, i)"
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
      <p v-if="hasActionItemErrors" class="error-message">
        {{ listLabel }} cannot contain empty items
      </p>
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
    <slot name="submit" :validateForm="validateForm"></slot>
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
      errors: {
        actionItems: (this.fields.actionItems || []).map(_ => false),
      },
    };
  },
  methods: {
    removeItem(index) {
      this.fields.actionItems.splice(index, 1);
      this.errors.actionItems.splice(index, 1);
    },
    addItem(list) {
      this.fields.actionItems.push('');
      this.errors.actionItems.push(false);
    },
    validateForm() {
      // Validate fields agains because inputs aren't flagged for being
      // empty until an attempt to edit it
      this.fields.actionItems.forEach((val, i) =>
          this.validateActionItems(val, i));
      this.validateSummary(this.fields.summary);
      this.validateDetails(this.fields.details);
      return this.hasErrors;
    },
    summaryOnChange(value) {
      this.fields.summary = value;
    },
    validateSummary(value) {
      if (value.trim().length === 0) {
        this.$set(this.errors, 'summary', 'Summary is a required field');
      } else {
        this.$delete(this.errors, 'summary', null);
      }
    },
    validateDetails(value) {
      if (value.trim().length === 0) {
        this.$set(this.errors, 'details', 'Details is a required field');
      } else {
        this.$delete(this.errors, 'details', null);
      }
    },
    validateActionItems(value, idx) {
      this.$set(this.errors.actionItems, idx, value.trim().length === 0);
    },
  },
  computed: {
    hasActionItemErrors() {
      return this.errors.actionItems.some(e => e); 
    },
    hasErrors() {
      return Object.keys(this.errors).length > 1 || this.hasActionItemErrors;
    },
    listLabel() {
      return this.fields.status === 'completed' ? 'Next Steps' : 'Action Items';
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
  margin-bottom: 4px;
}
.field.required label:after {
  color: #ca0000;
  content: '*';
  display:inline;
  font-weight: bold;
}

.field > textarea {
  min-height: 100px;
}
.field.error {
  border-left: 3px solid #ca0000;
  padding-left: 8px;
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
  margin-bottom: 8px;
}

.item > input {
  flex-grow: 1;
  margin-left: 8px;
}
</style>