<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();
const open = ref(true);
const isRootPath = computed(() => route.path === "/");
const { themeReady } = useTheme();
const { booklet_modules, venue_info } = useVenue();
const props = defineProps<{
  title?: string;
  description?: string;
}>();

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
        <ClientOnly>
          <template #fallback>
            <USkeleton class="size-8 rounded-md" />
          </template>
          <UIcon name="i-logos-nuxt-icon" class="size-8" />
        </ClientOnly>
      </template>
      <ClientOnly>
        <template #fallback>
          <USkeleton class="h-8 w-full mb-0.5" />
          <USkeleton class="h-8 w-full mb-0.5" />
          <USkeleton class="h-8 w-full mb-0.5" />
          <USkeleton class="h-8 w-full mb-0.5" />
        </template>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          tooltip
          :ui="{ link: 'p-1.5 my-2 overflow-hidden' }"
          class="grow"
        />
      </ClientOnly>
      <ClientOnly>
        <template #fallback>
          <USkeleton class="h-10 w-full rounded-md" />
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
      </ClientOnly>
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
          <ClientOnly>
            <template #fallback>
              <USkeleton class="h-7 w-48" />
            </template>
            <div class="text-2xl font-headline w-full">
              {{ venue_info[0]?.name }}
            </div>
          </ClientOnly>
        </div>
        <ClientOnly>
          <template #fallback>
            <USkeleton class="size-8 w-20 rounded-md shrink-0" />
          </template>
          <UColorModeSelect />
        </ClientOnly>
      </header>
      <div class="flex flex-col items-start justify-start p-4 w-full">
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
        <UCard variant="outline" class="w-full">
          <template #header>
            <template v-if="!themeReady">
              <USkeleton class="h-10 w-56 mb-2" />
              <USkeleton class="h-5 w-80" />
            </template>
            <template v-else>
              <div class="flex flex-col justify-center prose">
                <h1 class="text-4xl font-headline mb-2">
                  {{ title }}
                </h1>
                <p class="text-lg font-body text-muted">
                  {{ description }}
                </p>
              </div>
            </template>
          </template>
          <template v-if="!themeReady">
            <div class="flex flex-col gap-3">
              <USkeleton class="h-6 w-1/2" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-3/4" />
              <div class="grid grid-cols-3 gap-3 pt-2">
                <USkeleton class="h-28" />
                <USkeleton class="h-28" />
                <USkeleton class="h-28" />
              </div>
            </div>
          </template>
          <template v-else>
            <slot />
          </template>
        </UCard>
      </div>
    </main>
  </div>
</template>
