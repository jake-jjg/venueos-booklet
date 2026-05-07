<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();
const open = ref(true);
const isRootPath = computed(() => route.path === "/");
const { themeReady } = useTheme();
const { booklet_modules, venue_info } = useVenue();
const { title, description } = usePageHeader();

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
    <header
        class="bg-default z-20 flex justify-start w-full h-(--ui-header-height) items-center gap-2 py-4 pr-4 relative"
    >
        <div class="shrink-0 flex items-center px-4">
            <UTooltip
                :content="open ? 'Collapse sidebar' : 'Expand sidebar'"
                side="right"
            >
                <UButton
                    icon="i-lucide-panel-right"
                    color="neutral"
                    variant="ghost"
                    aria-label="Toggle sidebar"
                    @click="open = !open"
                />
            </UTooltip>
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

    <div
        class="flex bg-background flex-row h-[calc(100vh-var(--ui-header-height))"
        :key="route.path"
    >
        <USidebar
            v-model:open="open"
            variant="inset"
            collapsible="offcanvas"
            side="left"
            :ui="{
                container: 'h-full  pt-16',
            }"
        >
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
                    variant="solid"
                    class="justify-self-end"
                >
                    Schedule a Tour
                </UButton>
            </ClientOnly>
        </USidebar>
        <main class="w-full flex flex-col justify-stretch items-stretch pl-4">
            <div class="flex items-center w-full">
                <UCard
                    variant="soft"
                    class="w-full bg-white dark:bg-black z-30 h-[calc(100vh-var(--ui-header-height))] shadow-xl shadow-zinc-500/25 shadow- rounded-none rounded-tl-md"
                    :ui="{
                        header: 'p-4',
                        body: 'overflow-scroll h-[calc(100vh-165px)] pb-16',
                    }"
                >
                    <template #header>
                        <template v-if="!themeReady">
                            <div
                                class="flex justify-between items-center gap-2"
                            >
                                <div class="flex flex-col gap-2">
                                    <USkeleton class="h-10 w-56" />
                                    <USkeleton class="h-5 w-80" />
                                </div>
                                <USkeleton class="h-9 w-20 shrink-0" />
                            </div>
                        </template>
                        <template v-else>
                            <div
                                class="flex justify-between items-center gap-2"
                            >
                                <div>
                                    <h1 class="text-4xl font-headline mb-1">
                                        {{ title }}
                                    </h1>
                                    <p
                                        v-if="description"
                                        class="text-md font-body text-muted"
                                    >
                                        {{ description }}
                                    </p>
                                </div>
                                <UButton
                                    v-if="!isRootPath"
                                    icon="i-lucide-arrow-left"
                                    color="neutral"
                                    variant="outline"
                                    to="/"
                                >
                                    Back
                                </UButton>
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
