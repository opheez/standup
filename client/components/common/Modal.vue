<template>
  <div
    class="modal-backdrop"
    @click="hideModal"
  >
    <div class="modal-container">
      <h2>
        <slot name="title"></slot>
      </h2>
      <div class="body">
        <slot name="body"></slot>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',

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
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #F8F8F8;
  border: 2px solid #4A4A4A;
  border-radius: 12px;
  z-index: 9999;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}
</style>