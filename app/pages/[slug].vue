<script setup lang="ts">
// useState inside useVenue shares state — no extra fetches triggered
const { booklet_modules } = useVenue();
const route = useRoute();

const currentModule = computed(() =>
  booklet_modules.value.find(
    (item) => item.title.toLowerCase() === route.params.slug,
  ),
);

const contentType = computed(() => currentModule.value?.content_type ?? null);
const content = computed(() => currentModule.value?.content ?? null);

// Per-type content accessors
const textBody = computed(() => {
  if (contentType.value !== "Text" || !content.value) return null;
  return (content.value as Array<{ textContent: string }>)
    .map((block) => block.textContent)
    .filter(Boolean)
    .join("\n");
});

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
  <div class="flex-1 p-8 prose w-full">
    <!-- Text module -->
    <template v-if="contentType === 'Text'">
      <p v-if="textBody">{{ textBody }}</p>
      <p v-else class="text-muted">No text content yet.</p>
    </template>

    <!-- Fallback for unhandled content types -->
    <template v-else-if="contentType">
      <p class="text-muted">{{ contentType }} rendering coming soon.</p>
    </template>

    <!-- No module or no content type set -->
    <template v-else>
      <p class="text-muted">No content yet.</p>
    </template>
  </div>
</template>
