<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();
const props = defineProps<{
  title?: string;
  description?: string;
}>();

const open = ref(true);
const isRootPath = computed(() => route.path === "/");

// useState inside useVenue shares state — no extra fetches triggered
const { booklet_modules, venue_info, info_loading, module_loading } =
  useVenue();

// Map modules to navigation items
const NavigationModules = computed(() =>
  (booklet_modules.value ?? []).map((item: any) => ({
    label: item.title,
    icon: "i-lucide-" + item.icon,
    to: "/" + item.title.toLowerCase() + "/",
    tooltip: { text: item.title, content: { side: "right" } },
  })),
);

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Overview",
    icon: "i-lucide-house",
    to: "/",
    tooltip: { text: "Overview", content: { side: "right" } },
  },
  ...NavigationModules.value,
]);
</script>

<template>
  <div class="flex flex-row">
    <USidebar
      v-model:open="open"
      variant="floating"
      collapsible="offcanvas"
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
          tooltip
          :ui="{ link: 'p-1.5 my-2 overflow-hidden' }"
          class="grow"
        />
      </template>
      <UButton
        icon="i-lucide-calendar"
        size="xl"
        color="primary"
        variant="solid"
        class="justify-self-end"
      >
        Schedule a Tour
      </UButton>
    </USidebar>
    <main class="w-full flex flex-col justify-start items-start">
      <header
        class="border-b border-default flex justify-start w-full h-(--ui-header-height) items-center gap-2 py-10 pr-4"
      >
        <div class="shrink-0 flex items-start px-4">
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
            <div class="text-2xl font-headline w-full">
              {{ venue_info[0]?.name }}
            </div>
          </template>
        </div>
        <UColorModeSelect />
      </header>
      <div class="flex flex-col items-center p-4 w-full">
        <template v-if="!isRootPath">
          <UButton
            icon="i-lucide-arrow-left"
            color="primary"
            variant="ghost"
            to="/"
            class="mb-2"
          >
            Back
          </UButton>
        </template>
        <UCard class="w-full">
          <template #header>
            <div class="flex flex-col justify-center prose">
              <h1 class="text-4xl font-headline mb-2">
                {{ title }}
              </h1>
              <p class="text-lg font-body text-muted">
                {{ description }}
              </p>
            </div>
          </template>
          <slot />
        </UCard>
      </div>
    </main>
  </div>
</template>
