<template>
  <div>
    <button class="add-btn" @click="showModal">
      + Add Project
    </button>
    <Modal
      v-show="show"
      :hideModal="hideModal"
    >
      <template #title>
        Add Project
      </template>
      <template #body>
        Form content
      </template>
      <template #actions>
        <button @click="hideModal">Cancel</button>
        <button>Add</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue';

export default {
  name: 'AddProjectComponent',
  components: {Modal},
  data() {
    return {
      show: false,
    }
  },
  methods: {
    hideModal() {
      this.show = false;
    },
    showModal() {
      this.show = true;
    },
  }
}
</script>

<style scoped>
.add-btn {
  border-color: #50406d;
}
</style>