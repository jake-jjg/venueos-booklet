<script setup lang="ts">
import { DEFAULT_THEME_COLORS } from "~/composables/useTheme";

definePageMeta({
    layout: "settings",
});

const { setPageHeader } = usePageHeader();
setPageHeader("Color Scheme", "Edit your booklet's color scheme");

useSeoMeta({
    title: "Color Scheme",
    description: "Edit your booklet's color scheme",
});

const {
    colors,
    loading,
    saveTheme,
    generateColorScale,
    generateDarkBackground,
} = useTheme();

const darkBackground = computed(() => generateDarkBackground(draft.background));
const toast = useToast();

const draft = reactive({
    primary: colors.value.primary,
    secondary: colors.value.secondary,
    background: colors.value.background,
});

// Refs to the Coloris-bound inputs so we can programmatically trigger updates
const pickerRefs = reactive<Record<string, HTMLInputElement | null>>({
    primary: null,
    secondary: null,
    background: null,
});

const primaryScale = computed(() => generateColorScale(draft.primary));
const secondaryScale = computed(() => generateColorScale(draft.secondary));

const isDirty = computed(
    () =>
        draft.primary !== colors.value.primary ||
        draft.secondary !== colors.value.secondary ||
        draft.background !== colors.value.background,
);

// Validate and apply a picker change
function onColorInput(
    key: "primary" | "secondary" | "background",
    value: string,
) {
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        draft[key] = value;
    }
}

// Clicking the swatch opens Coloris on the corresponding input
function openPicker(key: string) {
    pickerRefs[key]?.click();
}

async function resetToDefaults() {
    draft.primary = DEFAULT_THEME_COLORS.primary;
    draft.secondary = DEFAULT_THEME_COLORS.secondary;
    draft.background = DEFAULT_THEME_COLORS.background;

    // Notify Coloris to refresh its thumbnails after Vue updates the DOM
    await nextTick();
    Object.values(pickerRefs).forEach((input) => {
        input?.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

async function handleSave() {
    const { error } = await saveTheme({ ...draft });
    if (error) {
        toast.add({
            title: "Failed to save colors",
            description: error.message,
            color: "error",
            icon: "i-lucide-circle-x",
        });
    } else {
        toast.add({
            title: "Color scheme saved",
            description: "Your changes are live across the booklet.",
            color: "success",
            icon: "i-lucide-circle-check",
        });
    }
}

const pickers = [
    {
        key: "primary" as const,
        label: "Primary Color",
        description: "Buttons, links, and interactive elements",
        icon: "i-lucide-mouse-pointer-click",
    },
    {
        key: "secondary" as const,
        label: "Secondary Color",
        description: "Accents, badges, and highlights",
        icon: "i-lucide-sparkles",
    },
    {
        key: "background" as const,
        label: "Background Color",
        description: "Page and card backgrounds",
        icon: "i-lucide-layout",
    },
];
</script>

<template>
    <div class="w-full flex flex-col gap-6">
        <!-- Color Pickers -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard variant="subtle" v-for="picker in pickers" :key="picker.key">
                <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon :name="picker.icon" class="size-4 text-muted" />
                        <span class="font-semibold text-sm">{{
                            picker.label
                        }}</span>
                    </div>
                </template>

                <div class="flex flex-col gap-3">
                    <!-- Large swatch — split light/dark for background, solid for others -->
                    <div
                        class="h-24 w-full rounded-lg border border-default cursor-pointer relative group overflow-hidden"
                        @click="openPicker(picker.key)"
                    >
                        <!-- Background card: show light + dark halves -->
                        <template v-if="picker.key === 'background'">
                            <div class="flex h-full">
                                <div
                                    class="flex-1"
                                    :style="{
                                        backgroundColor: draft.background,
                                    }"
                                />
                                <div class="w-px bg-default/30" />
                                <div
                                    class="flex-1"
                                    :style="{ backgroundColor: darkBackground }"
                                />
                            </div>
                            <div
                                class="absolute inset-0 flex items-center justify-center gap-6 pointer-events-none"
                            >
                                <UIcon
                                    name="i-lucide-sun"
                                    class="size-4 text-black/40"
                                />
                                <UIcon
                                    name="i-lucide-moon"
                                    class="size-4 text-white/60"
                                />
                            </div>
                        </template>
                        <!-- Other cards: solid color -->
                        <template v-else>
                            <div
                                class="w-full h-full"
                                :style="{ backgroundColor: draft[picker.key] }"
                            />
                        </template>
                        <div
                            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/15"
                        >
                            <UIcon
                                name="i-lucide-pipette"
                                class="size-5 text-white drop-shadow"
                            />
                        </div>
                    </div>

                    <!-- Dark mode hex label for background card -->
                    <div
                        v-if="picker.key === 'background'"
                        class="flex items-center justify-between gap-2 text-xs text-muted"
                    >
                        <span class="flex items-center gap-1">
                            <UIcon name="i-lucide-sun" class="size-3" /> Light
                        </span>
                        <span class="flex items-center gap-1">
                            <UIcon name="i-lucide-moon" class="size-3" /> Dark
                            auto-generated
                        </span>
                    </div>

                    <!-- Coloris-bound text input -->
                    <input
                        :ref="
                            (el) =>
                                (pickerRefs[picker.key] =
                                    el as HTMLInputElement | null)
                        "
                        type="text"
                        data-coloris
                        :value="draft[picker.key]"
                        class="coloris-input w-full px-3 py-2 rounded-md border border-default bg-elevated font-mono text-sm text-highlighted"
                        @input="
                            (e) =>
                                onColorInput(
                                    picker.key,
                                    (e.target as HTMLInputElement).value,
                                )
                        "
                    />

                    <p class="text-xs text-muted">{{ picker.description }}</p>
                </div>
            </UCard>
        </div>

        <!-- Shade Scale Preview -->
        <UCard variant="subtle">
            <template #header>
                <h3 class="font-semibold text-sm">Generated Color Scales</h3>
            </template>
            <div class="flex flex-col gap-4">
                <div>
                    <p class="text-xs text-muted mb-2 font-medium">Primary</p>
                    <div class="flex rounded-lg overflow-hidden h-8">
                        <div
                            v-for="(value, shade) in primaryScale"
                            :key="shade"
                            class="flex-1"
                            :title="`${shade}: ${value}`"
                            :style="{ backgroundColor: value }"
                        />
                    </div>
                </div>
                <div>
                    <p class="text-xs text-muted mb-2 font-medium">Secondary</p>
                    <div class="flex rounded-lg overflow-hidden h-8">
                        <div
                            v-for="(value, shade) in secondaryScale"
                            :key="shade"
                            class="flex-1"
                            :title="`${shade}: ${value}`"
                            :style="{ backgroundColor: value }"
                        />
                    </div>
                </div>
            </div>
        </UCard>

        <!-- Live Preview -->
        <UCard variant="subtle">
            <template #header>
                <h3 class="font-semibold text-sm">Live Preview</h3>
            </template>
            <div
                class="rounded-lg p-6 border border-default transition-colors"
                :style="{ backgroundColor: draft.background }"
            >
                <h2
                    class="text-xl font-headline mb-1"
                    :style="{ color: primaryScale[900] }"
                >
                    Sample Venue Booklet
                </h2>
                <p class="text-sm mb-4" :style="{ color: primaryScale[700] }">
                    This is how your color scheme will look across the booklet.
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        class="px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
                        :style="{ backgroundColor: draft.primary }"
                    >
                        Primary Action
                    </button>
                    <button
                        class="px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
                        :style="{ backgroundColor: draft.secondary }"
                    >
                        Secondary Action
                    </button>
                    <button
                        class="px-4 py-2 rounded-md text-sm font-medium border transition-opacity hover:opacity-90"
                        :style="{
                            borderColor: draft.primary,
                            color: draft.primary,
                        }"
                    >
                        Outline
                    </button>
                </div>
                <div class="mt-4 flex gap-2 flex-wrap">
                    <span
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                        :style="{
                            backgroundColor: primaryScale[100],
                            color: primaryScale[700],
                        }"
                    >
                        Primary Badge
                    </span>
                    <span
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                        :style="{
                            backgroundColor: secondaryScale[100],
                            color: secondaryScale[700],
                        }"
                    >
                        Secondary Badge
                    </span>
                </div>
            </div>
        </UCard>

        <!-- Save Bar -->
        <div class="flex items-center justify-between pt-2">
            <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-rotate-ccw"
                :disabled="loading"
                @click="resetToDefaults"
            >
                Reset to defaults
            </UButton>
            <UButton
                color="primary"
                icon="i-lucide-save"
                :loading="loading"
                :disabled="!isDirty"
                @click="handleSave"
            >
                Save Colors
            </UButton>
        </div>
    </div>
</template>
