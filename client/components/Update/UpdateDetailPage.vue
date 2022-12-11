<template>
    <section class="update">
      <h2 v-if="showProjectTitle">{{ project.projectName }}</h2>
      <div v-if="editing">
        <div class=field>
          <UpdateForm :fields="draft" :options="project.tags">
            <template #header>
              Edit Update
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
        <h2>{{ update.summary }}</h2>
        <div class="field">
          <h4>From</h4>
          <p>{{ update.author.firstName }} {{ update.author.lastName }}</p>
          <p>{{ update.author.email }}</p>
        </div>
        <div class="field">
          <h4>Last edited</h4>
          <p>{{ update.dateModified }}</p>
        </div>
        <div class="field">
          <h4>Status</h4>
          <p class="status" :class="statusToText[update.status]">
            {{ statusToText[update.status] }}
          </p>
        </div>
        <div class="field">
          <h4>Tags</h4>
          <p
            v-for="tag in this.update.tags"
            class="update-status status"
          >
            {{ tag }}
          </p>
          <p v-if="!update.tags.length">No tags were specified.</p>
        </div>
        <div 
          v-if="($store.state.email === update.author.email
                  && project.active === true)"
          class="eyeswanted">
          <AddEyesWantedComponent
          :update="update"
          :project="project"/>
        </div>
        <div class="field">
          <h4>Details</h4>
          <p>{{ update.details }}</p>
        </div>
        <div class="action-items field">
          <h4>{{ update.status === 'completed' ? 'Next Steps' : 'Action Items'}}</h4>
          <ul class="reset">
            <li
              v-for="item in update.actionItems"
            >
              {{ item }}
            </li>
          </ul>
          <p v-if="!update.actionItems.length">
            No {{ update.status === 'completed' ? 'next steps' : 'action items'}} were specified.
          </p>
        </div>
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
      </div>
    </section>
</template>
<script>
import UpdateForm from '@/components/Update/UpdateForm.vue';
import AddThanksComponent from '@/components/Thanks/AddThanks.vue';
import AddEyesWantedComponent from '@/components/EyesWanted/AddEyesWanted.vue';
import CompleteEyesWantedComponent from '@/components/EyesWanted/CompleteEyesWanted.vue';
import UpdateSidebar from '@/components/Update/UpdateSidebar.vue';

export default {
  name: 'UpdateDetailPage',
  components: {UpdateForm, UpdateSidebar, AddThanksComponent, AddEyesWantedComponent, CompleteEyesWantedComponent},
  props: {
    update: {
      type: Object,
    },
    project: {
      type: Object,
      required: true,
    },
    showProjectTitle: Boolean,
  },
  computed: {
    inReadingList() {
      const eyeswanted = this.$store.state.eyeswanted;
      this.eyeswanted = eyeswanted.filter(eyeswanted => eyeswanted.update._id === this.update._id)[0] || '';
      return this.eyeswanted;
    },
  },
  methods: {
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
        tags: [...this.update.tags],
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
          return value.length === otherValue.length && value.every((val, i) => val === otherValue[i]);
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
          projectId: this.project._id,
        }),
      };
      try {
        const res = await fetch(
          `/api/updates/${this.update._id}`, options);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully updated update!',
        });
        this.$store.commit('refreshUpdates', this.project._id);
        this.$store.commit('setCurrentUpdate', resJson.update);
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
          `/api/updates/${this.update._id}`, options);
        const resJson = await res.json();
        if (!res.ok) {
          throw Error(resJson.error);
        }
        this.$store.commit('alert', {
          status: 'success',
          message: 'Successfully deleted update!',
        });
        this.$store.commit('refreshUpdates', this.project._id);
        this.$store.commit('setCurrentUpdate', null);
      } catch (e) {
        this.$store.commit('alert', {
          status: 'error',
          message: e,
        });
      }
    },
  },
  data() {
    return {
      editing: false,
      draft: this.update,
      alerts: {}, // Displays success/error messages encountered during update modification
      statusToText: {
        'inprogress': 'In-Progress',
        'blocked': 'Blocked',
        'completed': 'Completed',
      },
    }
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

.thanks-number {
  font-size: 80%;
  color:rgb(125, 125, 125);
}

.update {
  position: relative;
}

.update .edit-btns {
  margin-top: 12px;
}
.edit-btns button + button {
  margin-left: 8px;
}
.update-metadata .field p,
.update-metadata .field h4 {
  margin: 4px 0;
}
.update-metadata .field {
  margin-bottom: 20px;
}
</style>