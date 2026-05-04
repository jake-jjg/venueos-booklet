<script setup lang="ts">
// useState inside useVenue shares state — no extra fetches triggered
const { info_loading, module_loading, booklet_modules } = useVenue();

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
        <template v-if="info_loading">
            <USkeleton class="h-10 w-lg rounded mb-4" />
            <USkeleton class="h-6 w-5xl rounded mb-8" />
        </template>

        <template v-else>
            Content goes here
        </template>

        <USeparator class="mb-8" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <template v-if="module_loading">
                <UCard v-for="i in 3" :key="i">
                    <USkeleton class="h-6 w-3/4 mb-3" />
                    <USkeleton class="h-4 w-full mb-2" />
                    <USkeleton class="h-4 w-2/3" />
                </UCard>
            </template>

            <template v-else>
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
                        spotlight
                        spotlight-color="primary"
                        reverse="true"
                        :ui="{ title: 'text-xl font-headline' }"
                    >
                        <template v-if="module.cover_img">
                            <img :src="module.cover_img" :alt="module.title"></img>
                        </template>
                        <template v-else>
                            <img src="/placeholder.png" :alt="module.title"></img>
                        </template>
                    </UPageCard>
                </NuxtLink>
            </template>
        </div>
    </div>
</template>
