<script setup lang="ts">
const { fetchVenueData, venue_info } = useVenue();
await callOnce(fetchVenueData);

useHead({
    titleTemplate: (titleChunk) => {
        const venueName = venue_info.value[0]?.name;
        return titleChunk && venueName
            ? `${titleChunk} | ${venueName}`
            : (venueName ?? "Venue Booklet");
    },
});
</script>

<template>
    <UApp>
        <UTheme
            :ui="{
                card: {
                    root: 'rounded-lg',
                },
                pageCard: {
                    root: 'rounded-lg',
                },
                sidebar: {
                    inner: 'rounded-lg',
                },
                select: {
                    base: 'rounded-md pointer',
                },
                button: {
                    base: 'rounded-md pointer',
                },
                input: {
                    base: 'pointer',
                },
            }"
        >
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </UTheme>
    </UApp>
</template>
