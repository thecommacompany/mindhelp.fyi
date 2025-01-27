<template>
    <select name="language" id="language" v-model="lang" class="form-select">
        <option value="en">English</option>
        <option value="ml">മലയാളം
        </option>
    </select>
</template>

<script setup lang="ts">
const { setLocale } = useI18n()
let lang = ref('en')
watch(() => lang.value, (newValue) => {
    setLocale(newValue)
})

</script>
<style scoped>
.form-select {
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-select:hover {
  border-color: #B8C5B0;
}

.form-select:focus {
  outline: none;
  border-color: #B8C5B0;
  box-shadow: 0 0 0 2px rgba(184, 197, 176, 0.2);
}
</style>