<template>
  <div
    class="modal-backdrop"
    @click="hideModal"
  >
    <!-- Hide modal on click on backdrop, but not the container itself -->
    <div class="modal-container" @click.stop="">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    hideModal: {
      type: Function,
      required: true,
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

.modal-container {
  position: relative;
  width: 500px;
  max-height: 90vh;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #F8F8F8;
  border: 2px solid #4A4A4A;
  border-radius: 12px;
  overflow-y: scroll;
  z-index: 9999;
}
</style>