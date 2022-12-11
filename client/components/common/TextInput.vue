<template>
  <div class="text-input">
    <textarea
      v-if="textarea"
      :name="name"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :value="value"
      @input="onChange($event.target.value)"
    ></textarea>
    <input
      v-else
      type="text"
      :name="name"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :value="value"
      @input="onChange($event.target.value)"
    />
    <p>{{value.length}}/{{maxLength}} characters</p>
  </div>
</template>
<script>
export default {
  name: 'TextInput',
  props: {
    textarea: false,
    name: String,
    value: String,
    placeholder: String,
    length: Number,
    maxLength: Number,
    onChange: {
      type: Function,
      required: true,
    }
  },

}
</script>

<style scoped>
.text-input {
  display: flex;
  flex-direction: column;
}
input, textarea {
  width: 100%;
}
p {
  margin: 4px 0 0 0;
  font-size: 80%;
  color:rgb(125, 125, 125);
}
</style>