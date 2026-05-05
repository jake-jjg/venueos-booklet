<script setup lang="ts">
const { booklet_modules } = useVenue();
const { setPageHeader } = usePageHeader();

// Set page header
setPageHeader("Overview", "Your digital wedding & event booklet.");

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Overview",
  description: "Your digital wedding & event booklet.",
});
</script>

<template>
    <div class="flex-1 w-full">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <NuxtLink
                    v-for="module in booklet_modules"
                    :key="module.id"
                    :to="`/${module.title.toLowerCase()}/`"
                    class="group"
                >
                    <UPageCard
                        class="h-full transition-shadow group-hover:shadow-md"
                        :title="module.title"
                        :description="module.description"
                        reverse="true"
                        spotlight
                        :ui="{ title: 'text-xl font-headline', description: 'text-md font-body' }"
                    >
                        <template v-if="module.cover_img">
                            <img :src="module.cover_img" :alt="module.title"></img>
                        </template>
                        <template v-else>
                            <img src="/placeholder.png" :alt="module.title"></img>
                        </template>
                    </UPageCard>
                </NuxtLink>
        </div>
    </div>
</template>
