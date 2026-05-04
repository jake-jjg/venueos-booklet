<script setup lang="ts">
// useState inside useVenue shares state — no extra fetches triggered
const { booklet_modules, info_loading } = useVenue();
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
    <div class="flex-1 p-8 prose w-full items-stretch">
        <template v-if="info_loading">
            <USkeleton class="h-10 w-lg rounded mb-4" />
            <USkeleton class="h-6 w-5xl rounded mb-8" />
        </template>

        <template v-else>
            <h1 class="text-4xl font-headline font-weight-headline mb-4">
                {{ currentModule?.title }}
            </h1>
            <p class="font-body font-weight-body mb-8">
                {{ currentModule?.description }}
            </p>
        </template>
        <USeparator />
    </div>
</template>
