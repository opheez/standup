<template>
  <div class="container">
    <UpdateSidebar :project="project"/>
    <main>
      <h1>
        Project: {{ project.projectName }}
      </h1>
      <UpdateForm
        :fields="fields"
        :options="project.tags"
      >
        <template #header>
            Add update form
        </template>
        <template #submit="slotProps">
          <button
            type="submit" @click="submit(slotProps.validateForm)">Add Update</button>
        </template>
      </UpdateForm>
    </main>
  </div>
</template>

<script>
import GetCurrentProject from '@/components/Update/GetCurrentProject.vue';
import UpdateForm from '@/components/Update/UpdateForm.vue';
import UpdateSidebar from '@/components/Update/UpdateSidebar.vue';

export default {
  name: 'AddUpdatePage',
  mixins: [GetCurrentProject],
  components: {UpdateForm, UpdateSidebar},
  data() {
    return {
      fields: {
        summary: '',
        details: '',
        status: 'inprogress',
        actionItems: [''],
        tags: [],
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
    async submit(validateForm) {
      if (validateForm()) {
        this.$store.commit('alert', {
          status: 'error',
          message: 'Please fix form errors before submitting',
        });
        return;
      }
      const body = {
        ...this.fields,
        projectId: this.$route.params.id,
      };
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify(body),
      };
      try {
        const res = await fetch('/api/updates', options);
        const resJson = await res.json();
        if (!res.ok) {
          const resJson = await res.json();
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