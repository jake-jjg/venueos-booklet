<script setup lang="ts">
definePageMeta({
  layout: "settings",
});

const route = useRoute();
const moduleType = route.query.module_type;

const pageTitle = computed(() => `Add New ${moduleType} Modules`);
const pageDescription = "Customize your booklet's modules";

const { setPageHeader } = usePageHeader();
setPageHeader(pageTitle, pageDescription);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
});
</script>

<template>

  <template v-if="moduleType == 'content'">
    <Editor />
  </template>

  <template v-else>
    <div class="w-full">Add a new {{ moduleType }} module.</div>
  </template>
  
  <!-- Save Bar -->
  <div class="flex items-center justify-between pt-2">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-rotate-ccw"
      :disabled="loading"
      @click="resetToDefaults"
    >
      Reset to defaults
    </UButton>
    <UButton
      color="primary"
      icon="i-lucide-save"
      :loading="loading"
      :disabled="!isDirty"
      @click="handleSave"
    >
      Save Module
    </UButton>
  </div>
</template>
