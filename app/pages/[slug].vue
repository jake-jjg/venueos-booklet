<script setup lang="ts">
// useState inside useVenue shares state — no extra fetches triggered
const { booklet_modules } = useVenue();
const route = useRoute();

const currentModule = computed(() =>
  booklet_modules.value.find(
    (item) => item.title.toLowerCase() === route.params.slug,
  ),
);

setPageLayout("default", {
  title: currentModule.value?.title,
  description: currentModule.value?.description,
});

useSeoMeta({
  title: () => currentModule.value?.title ?? "",
  description: () => currentModule.value?.description ?? "",
});
</script>

<template>
  <div class="flex-1 p-8 prose w-full items-stretch">content goes here</div>
</template>
