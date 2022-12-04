<template>
  <main>
    <h1>
      Project: {{ project.projectName }}
    </h1>
    <section class="update">
      <div
        class="edit-btns"
        v-if="(update.author.email === $store.state.email && !editing)"
      >
        <button
          class="thin-btn invert"
          @click="startEditing">
          ✏️ Edit
        </button>
        <button
          class="thin-btn invert"
          @click="deleteUpdate">
          🗑️ Delete
        </button>
      </div>
      <div v-if="editing">
        <div class=field>
          <UpdateForm :fields="draft">
            <template #header>
              Edit update form
            </template>
            <template #submit>
              <div class="edit-btns">
                <button
                  class="thin-btn invert"
                  @click="saveEdits">
                  ✅ Save
                </button>
                <button
                  class="thin-btn invert"
                  @click="stopEditing">
                  🚫 Discard
                </button>
                <button
                  class="thin-btn invert"
                  @click="deleteUpdate">
                  🗑️ Delete
                </button>
              </div>
            </template>
          </UpdateForm>
        </div>
      </div>
      <div class="update-metadata" v-else>
        <h2>
          {{ update.summary }}
        </h2>
        <p class="metadata">
          {{ update.author.firstName }} {{ update.author.lastName }} ({{ update.author.email }})
          <br></br>
          {{ update.dateModified }}
        </p>
        <p class="status" :class="statusToText[update.status]">
          {{ statusToText[update.status] }}
        </p>
        <div 
          v-if="($store.state.email === update.author.email
                  && project.active === true)"
          class="eyeswanted">
          <AddEyesWantedComponent
          :update="update"
          :project="project"/>
        </div>
        <h3>Details</h3>
        <p>
          {{ update.details }}
        </p>
        <div class="action-items">
          <h3>Action Items</h3>
          <ul class="reset">
            <li
              v-for="item in update.actionItems"
            >
              {{ item }}
            </li>
          </ul>
          <p v-if="!update.actionItems.length">No action items were specified.</p>
        </div>
      </div>
      </br>
      <div 
        v-if="inReadingList"
        class="eyeswanted">
        <CompleteEyesWantedComponent
        :update="update"
        :eyeswanted="this.eyeswanted"/>
      </div>
      <div 
        v-if="($store.state.email !== update.author.email
                && project.active === true)"
        class="thanks">
        <AddThanksComponent
        :update="update"/>
      </div>
      <div
        v-if="(this.update.author.email === $store.state.email && isThankedby())">
        <p class="thanks-number">
        {{ this.thanks.length }} thanks </p>
        <p v-for="thanks in this.thanks"
          class="thanks-number">
          by {{ thanks.postUser.firstName }} {{thanks.postUser.lastName}}
        </p>
      </div>
    </section>
  </main>
</template>
<script>
import UpdateForm from '@/components/Update/UpdateForm.vue';
import AddThanksComponent from '@/components/Thanks/AddThanks.vue';
import AddEyesWantedComponent from '@/components/EyesWanted/AddEyesWanted.vue';
import CompleteEyesWantedComponent from '@/components/EyesWanted/CompleteEyesWanted.vue';

export default {
  name: 'UpdateDetailPage',
  components: {UpdateForm, AddThanksComponent, AddEyesWantedComponent, CompleteEyesWantedComponent},
  computed: {
    inReadingList() {
      const eyeswanted = this.$store.state.eyeswanted;
      this.eyeswanted = eyeswanted.filter(eyeswanted => eyeswanted.update._id === this.update._id)[0] || '';
      return this.eyeswanted;
    },
  },
  methods: {
    findFields(projectId, updateId) {
      if (!(projectId in this.$store.state.updates)) {
        return null;
      }
      const project = this.$store.state.projects.find(
          proj => proj._id === projectId);
      const update = (this.$store.state.updates[projectId] || []).find(
          u => u._id === updateId);
      return {project, update};
    },
    // Redirect if the corresponding update does not exist
    verifyUpdate() {
      if (!this.update) {
        this.$router.push({name: 'Not Found'});
      }
    },
    isThankedby() {
      const allthanks = this.$store.state.allthanks;
      this.thanks = allthanks.filter(thanks => thanks.updateId._id === this.update._id);
      console.log(this.thanks);
      return this.thanks;
    },
    startEditing() {
      this.editing = true;
      this.draft = {
        ...this.update,
        actionItems: [...this.update.actionItems],
      };
    },
    stopEditing() {
      this.editing = false;
      this.draft = this.update;
    },
    async saveEdits() {
      const contentUnchanged = Object.entries(this.draft).every(([key, value]) => {
        const otherValue = this.update[key];
        if (value instanceof Array) {
          return value.every((val, i) => val === otherValue[i]);
        }
        return otherValue === value;
      });
      if (contentUnchanged) {
        this.$store.commit('alert', {
          status: 'error',
          message: 'Error: Edited content should be different than current content'
        });
        return;
      }
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          ...this.draft,
          projectId: this.$route.params.projectId,
        }),
      };
      try {
        const res = await fetch(
          `/api/updates/${this.$route.params.updateId}`, options);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully updated update!',
        });
        this.$store.commit('refreshUpdates', this.$route.params.projectId);
        this.stopEditing();
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
    },
    async deleteUpdate() {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      };
      try {
        const res = await fetch(
          `/api/updates/${this.$route.params.updateId}`, options);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully deleted update!',
        });
        this.$store.commit('refreshUpdates', this.$route.params.projectId);
        this.$router.push({
          name: 'Updates',
          params: {
            id: this.$route.params.projectId,
          }
        });  
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
    },
  },
  data() {
    const {project, update} = this.findFields(
        this.$route.params.projectId, this.$route.params.updateId);
    return {
      update,
      project,
      editing: false,
      draft: update,
      alerts: {}, // Displays success/error messages encountered during update modification
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
    }
  },
  watch: {
    "$route.params": {
      handler: function(value) {
        const {projectId, updateId} = value;
        const {project, update} = this.findFields(
          projectId, updateId);
        this.project = project;
        this.update = update;
        this.verifyUpdate();
      },
      deep: true,
      immediate: true,
    },
    "$store.state.updates": {
      handler: function(value) {
        const { update } = this.findFields(
          this.$route.params.projectId, this.$route.params.updateId);
        this.update = update;
        this.verifyUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style scoped>
.update ul.reset,
.update ul.reset li {
  list-style-type: disc;
}

.update ul.reset {
  padding-left: 24px;
}

<<<<<<< HEAD
.thanks-number {
  font-size: 80%;
  color:rgb(125, 125, 125);
}

=======
>>>>>>> Enable editing of updates
.update {
  position: relative;
}
.update .edit-btns {
  position: absolute;
  top: 0;
  right: 12px;
}
.edit-btns button + button {
  margin-left: 8px;
}
</style>