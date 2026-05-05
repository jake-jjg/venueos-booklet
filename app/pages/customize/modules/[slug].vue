<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const slug = route.params.slug as string;
const title = "Edit Module: " + slug.charAt(0).toUpperCase() + slug.slice(1);

useSeoMeta({
  title,
  description: "Customize your booklet's modules",
});

setPageLayout("settings", { title });
</script>

<template>
  <UButton
    :to="`/customize/modules/view`"
    icon="i-lucide-arrow-left"
    variant="outline"
    size="sm"
  >
    Back to Modules
  </UButton>
  <div class="w-full"></div>
</template>
