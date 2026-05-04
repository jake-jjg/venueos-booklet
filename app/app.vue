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
                button: {
                    base: 'rounded',
                },
                input: {
                    base: 'pointer',
                },
            }"
        >
            <NuxtLayout>
                <NuxtPage></NuxtPage>
            </NuxtLayout>
        </UTheme>
    </UApp>
</template>
