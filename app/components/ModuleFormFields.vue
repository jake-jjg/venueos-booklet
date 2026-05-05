<script setup lang="ts">
const title = defineModel<string>("title", { required: true });
const description = defineModel<string>("description");
const icon = defineModel<string>("icon");
</script>

<template>
  <!-- Form Fields -->
  <div class="grid grid-cols-1 gap-4 w-full max-w-2xl">
    <UFormGroup label="Module Title" required>
      <UFormField label="Title">
        <UInput
          v-model="title"
          size="xl"
          class="w-full"
          placeholder="Enter module title"
          icon="i-lucide-heading"
        />
      </UFormField>
    </UFormGroup>

    <UFormGroup label="Description">
      <UFormField label="Description">
        <UInput
          v-model="description"
          size="xl"
          class="w-full"
          placeholder="Brief description of this module"
          icon="i-lucide-text"
        />
      </UFormField>
    </UFormGroup>

    <UFormGroup label="Icon">
      <UFormField label="Icon">
        <IconPicker v-model="icon" class="w-full" />
      </UFormField>
    </UFormGroup>
  </div>
</template>
