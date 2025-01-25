<template>
       <div class="space-y-5">
              <div class="space-y-3">
                <Label>Select Services</Label>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="service,index in Object.entries(ServiceType)" :key="index" class="flex items-center space-x-2">
                    <Checkbox 
                      :id="String(index)"
                      :checked="props.form?.services?.includes(service[0]) || false"
                      @update:checked="(checked) => handleServiceChange(service[0], checked)"
                    />
                    <Label :for="String(index)">{{ formatServiceName(service[0]) }}</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" @click="$emit('changeTab')" variant="outline" class="mr-3">Back</Button>
                <Button @click="$emit('handleSubmit')">{{ isEditing ? 'Update' : 'Create' }}</Button>
              </DialogFooter>
            </div>
</template>
<script setup lang="ts">
interface FormType {
  services: string[];
  [key: string]: any;
}

const props = defineProps({
  ServiceType: {
    type: Object,
    required: true
  },
  form: {
    type: Object as () => FormType,
    required: true
  },
  isEditing: {
    type: Boolean,
    required: true
  },
})

const emit = defineEmits(['handleSubmit', 'changeTab', 'update:form'])

function handleServiceChange(service: string, checked: boolean) {
  if (!props.form.services) {
    props.form.services = []
  }
  
  const services = [...props.form.services]
  if (checked) {
    if (!services.includes(service)) {
      services.push(service)
    }
  } else {
    const index = services.indexOf(service)
    if (index !== -1) {
      services.splice(index, 1)
    }
  }
  props.form.services = services
}

function formatServiceName(name: string) {
  return name.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

</script>