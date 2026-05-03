<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

// Inject venue data from app.vue
const venueData = inject<any>("venueData");
const { booklet_modules, venue_info, info_loading, module_loading } = venueData;
</script>

<template>
  <div class="flex-1 p-8 prose w-full items-stretch">
    <template v-if="info_loading">
      <USkeleton class="h-10 w-lg rounded mb-4" />
      <USkeleton class="h-6 w-5xl rounded mb-8" />
    </template>

    <template v-else>
      <h2 class="text-4xl font-headline tracking-wide mb-4">Overview</h2>
      <p class="font-body mb-8">
        This is your digital wedding & event booklet. Fill this with your
        content to help your brides better understand what it is you offer.
      </p>
    </template>
    <USeparator />
  </div>
</template>
