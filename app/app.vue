<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from "@nuxt/ui";

const open = ref(true);
const {
  booklet_modules,
  venue_info,
  info_loading,
  module_loading,
  fetchVenueData,
} = useVenue();

onMounted(() => {
  fetchVenueData();
});

//Map the modules to an array for use in the sidebar
const NavigationModules = computed(() => {
  if (booklet_modules.value) {
    return booklet_modules.value.map((item) => ({
      label: item.title,
      icon: "i-lucide-" + item.icon,
    }));
  }
  return [];
});

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Overview",
    icon: "i-lucide-house",
    active: true,
  },
  ...NavigationModules.value,
]);

// Provide the venue data to child components via inject
provide("venueData", {
  booklet_modules,
  venue_info,
  info_loading,
  module_loading,
});
</script>

<template>
  <UApp>
    <UTheme
      :ui="{
        button: {
          base: 'rounded-full',
        },
      }"
    >
      <div class="flex flex-row">
        <USidebar
          v-model:open="open"
          variant="sidebar"
          collapsible="icon"
          side="left"
          :ui="{
            container: 'h-full',
          }"
        >
          <template #header>
            <UIcon name="i-logos-nuxt-icon" class="size-8" />
          </template>
          <template v-if="module_loading">
            <USkeleton class="h-8 w-full mb-0.5" />
            <USkeleton class="h-8 w-full mb-0.5" />
            <USkeleton class="h-8 w-full mb-0.5" />
            <USkeleton class="h-8 w-full mb-0.5" />
          </template>
          <template v-else>
            <UNavigationMenu
              :items="items"
              orientation="vertical"
              :ui="{ link: 'p-1.5 my-2 overflow-hidden' }"
              $click=""
            />
          </template>
        </USidebar>
        <main class="w-full flex flex-col justify-start items-start">
          <header
            class="border-b border-default flex justify-start w-full h-(--ui-header-height) items-center gap-2 pr-4"
          >
            <div class="shrink-0 flex items-center px-4">
              <UButton
                icon="i-lucide-panel-right"
                color="neutral"
                variant="ghost"
                aria-label="Toggle sidebar"
                @click="open = !open"
              />
            </div>
            <div class="w-full">
              <template v-if="info_loading">
                <USkeleton class="size-10 w-50" />
              </template>
              <template v-else>
                <h1 class="text-2xl font-headline tracking-wide w-full">
                  {{ venue_info[0]?.name }}
                </h1>
              </template>
            </div>
            <UColorModeSelect />
          </header>
          <NuxtPage></NuxtPage>
        </main>
      </div>
    </UTheme>
  </UApp>
</template>
