<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { type ComputedRef } from "vue";

const open = ref(true);
const route = useRoute();
const { themeReady } = useTheme();
const {
    public: { siteUrl },
} = useRuntimeConfig();
const { booklet_modules, venue_info } = useVenue();

const { title, description } = usePageHeader();

// Slideover state for add new module (shared via composable)
const {
    isOpen: addNewModuleOpen,
    open: openAddModuleSlideover,
    close: closeAddModuleSlideover,
} = useAddModuleSlideover();

const addNewModuleItems = [
    {
        label: "Content",
        icon: "i-lucide-text-initial",
        to: "/customize/modules/add-new?module_type=content",
    },
    {
        label: "Pricing",
        icon: "i-lucide-dollar-sign",
        to: "/customize/modules/add-new?module_type=pricing",
    },
    {
        label: "Amenities",
        icon: "i-lucide-list",
        to: "/customize/modules/add-new?module_type=amenities",
    },
    {
        label: "Gallery",
        icon: "i-lucide-images",
        to: "/customize/modules/add-new?module_type=gallery",
    },
    {
        label: "FAQ",
        icon: "i-lucide-circle-question-mark",
        to: "/customize/modules/add-new?module_type=faq",
    },
    {
        label: "Virtual Tours",
        icon: "i-lucide-binoculars",
        to: "/customize/modules/add-new?module_type=virtual_tours",
    },
];

const router = useRouter();

function openAddNewModule(e: Event) {
    e.preventDefault();
    openAddModuleSlideover();
}

const moduleChildren: NavigationMenuItem[] = [
    {
        label: "Add New Module",
        icon: "i-lucide-square-plus",
        onSelect: openAddNewModule,
        tooltip: { text: "Add New Module", content: { side: "right" } },
    },
    {
        label: "View Modules",
        icon: "i-lucide-table",
        to: "/customize/modules/view/",
        tooltip: { text: "All Modules", content: { side: "right" } },
    },
];

const themeChildren: NavigationMenuItem[] = [
    {
        label: "Color Scheme",
        icon: "i-lucide-palette",
        to: "/customize/theme/color-scheme/",
        tooltip: { text: "Color Scheme", content: { side: "right" } },
    },
    {
        label: "Typography",
        icon: "i-lucide-type",
        to: "/customize/theme/typography/",
        tooltip: { text: "Typography", content: { side: "right" } },
    },
    {
        label: "Design Options",
        icon: "i-lucide-paintbrush",
        to: "/customize/theme/design-options/",
        tooltip: { text: "Design Options", content: { side: "right" } },
    },
];

const isChildActive = (children: NavigationMenuItem[]) =>
    children.some(
        (child) =>
            child.to &&
            route.path.startsWith((child.to as string).replace(/\/$/, "")),
    );

const items: ComputedRef<NavigationMenuItem[]> = computed(() => [
    {
        label: "Dashboard",
        icon: "i-lucide-home",
        to: "/customize/",
        tooltip: { text: "Dashboard", content: { side: "right" } },
    },
    {
        label: "Modules",
        icon: "i-lucide-book-a",
        active: isChildActive(moduleChildren),
        open: isChildActive(moduleChildren),
        tooltip: { text: "Modules", content: { side: "right" } },
        children: moduleChildren,
    },
    {
        label: "Theme",
        icon: "i-lucide-swatch-book",
        active: isChildActive(themeChildren),
        open: isChildActive(themeChildren),
        tooltip: { text: "Theme", content: { side: "right" } },
        children: themeChildren,
    },
    {
        label: "Settings",
        icon: "i-lucide-settings",
        to: "/customize/settings/",
        tooltip: { text: "General", content: { side: "right" } },
    },
]);
</script>

<template>
    <header
        class="bg-elevated z-50 border-b border-default flex justify-start w-full h-(--ui-header-height) items-center gap-2 py-4 pr-4"
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
            <ClientOnly>
                <template #fallback>
                    <USkeleton class="h-7 w-48" />
                </template>
                <div class="text-2xl font-headline w-full">
                    Booklet Settings
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
        class="flex flex-row bg-elevated/50 h-[calc(100vh-var(--ui-header-height))"
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
                    :ui="{ link: 'p-1.5 my-2 overflow-hidden' }"
                    class="grow"
                />
                <UButton
                    icon="i-lucide-square-plus"
                    size="xl"
                    color="primary"
                    @click="openAddModuleSlideover"
                >
                    Add New Module
                </UButton>
            </ClientOnly>
        </USidebar>
        <main class="w-full flex flex-col justifystretch items-strech pl-4">
            <div class="flex items-center w-full">
                <UCard
                    variant="soft"
                    class="w-full bg-default h-[calc(100vh-var(--ui-header-height))] shadow-lg rounded-none rounded-tl-3xl"
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
                                    <USkeleton class="h-10 w-48" />
                                    <USkeleton class="h-5 w-72" />
                                </div>
                                <USkeleton class="h-9 w-28 shrink-0" />
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
                                <UTooltip text="Open your booklet in a new tab">
                                    <UButton
                                        icon="i-lucide-eye"
                                        size="md"
                                        color="neutral"
                                        variant="outline"
                                        :to="siteUrl"
                                        target="_blank"
                                    >
                                        View Booklet
                                    </UButton>
                                </UTooltip>
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
                        <slot class="mh-full overflow-scroll" />
                    </template>
                </UCard>
            </div>
        </main>

        <!-- Add New Module Slideover -->
        <USlideover
            v-model:open="addNewModuleOpen"
            title="Select Module Type"
            description="Choose a module type to get started"
        >
            <template #body>
                <div class="flex flex-col gap-2">
                    <UButton
                        v-for="item in addNewModuleItems"
                        :key="item.label"
                        block
                        :icon="item.icon"
                        variant="outline"
                        size="lg"
                        class="justify-start ml-4"
                        @click="
                            () => {
                                closeAddModuleSlideover();
                                router.push(item.to);
                            }
                        "
                    >
                        {{ item.label }}
                    </UButton>
                </div>
            </template>
        </USlideover>
    </div>
</template>
