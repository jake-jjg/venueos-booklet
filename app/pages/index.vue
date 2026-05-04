<script setup lang="ts">
// useState inside useVenue shares state — no extra fetches triggered
const { booklet_modules } = useVenue();

useSeoMeta({
    title: "Overview",
    description: "Your digital wedding & event booklet.",
});

definePageMeta({
    layout: {
        props: {
            title: "Overview",
            description: "Your digital wedding & event booklet.",
        },
    },
});
</script>

<template>
    <div class="flex-1 p-8 w-full">

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
                        variant="subtle"
                        spotlight
                        spotlight-color="primary"
                        reverse="true"
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
