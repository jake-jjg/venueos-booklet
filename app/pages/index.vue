<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from "@nuxt/ui";
import { createClient } from "@supabase/supabase-js";
const open = ref(true);
const config = useRuntimeConfig();
const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
);
const booklet_modules = ref([]);
const venue_info = ref([]);
const info_loading = ref(true);
const module_loading = ref(true);

//Make a call to supabase to get the booklet modules
async function getbooklet_modules() {
    const { data } = await supabase
        .from("booklet_modules")
        .select()
        .eq("venue_id", config.public.venueId);

    booklet_modules.value = data;
    module_loading.value = false;
}

//Get venue information from supabase
async function getVenue_info() {
    const { data } = await supabase
        .from("venues")
        .select()
        .eq("id", config.public.venueId);

    venue_info.value = data;
    info_loading.value = false;
}

onMounted(() => {
    getbooklet_modules();
    getVenue_info();
});

//Map the modules to an array for use in the sidebar
const NavigationModules = computed(() => {
    if (booklet_modules.value) {
        booklet_modules.value.map((item) => ({
            label: item.title,
            icon: item.icon,
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
</script>

<template>
    <div class="flex flex-1">
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

            <UNavigationMenu
                :items="items"
                orientation="vertical"
                :ui="{ link: 'p-1.5 my-2 overflow-hidden' }"
            />
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
                        <USkeleton class="size-10 w-sm" />
                    </template>
                    <template v-else>
                        <h1 class="text-2xl font-headline tracking-wide w-full">
                            {{ venue_info[0]?.name }}
                        </h1>
                    </template>
                </div>
                <UColorModeSelect />
            </header>
            <div class="flex-1 p-8 prose w-full items-stretch">
                <template v-if="info_loading">
                    <USkeleton class="h-10 w-lg rounded mb-4" />
                    <USkeleton class="h-6 w-5xl rounded mb-8" />
                </template>

                <template v-else>
                    <h2 class="text-4xl font-headline tracking-wide mb-4">
                        Overview
                    </h2>
                    <p class="font-body mb-8">
                        This is your digital wedding & event booklet. Fill this
                        with your content to help your brides better understand
                        what it is you offer.
                    </p>
                </template>
                <USeparator />
            </div>
        </main>
    </div>
</template>
