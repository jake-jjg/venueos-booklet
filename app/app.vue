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
          root: 'rounded-sm',
        },
        pageCard: {
          root: 'rounded-sm',
        },
        sidebar: {
          inner: 'rounded-sm',
        },
        select: {
          base: 'rounded-sm pointer',
        },
        button: {
          base: 'rounded-sm pointer',
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
