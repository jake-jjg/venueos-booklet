<script setup lang="ts">
import { DEFAULT_THEME_COLORS } from "~/composables/useTheme";

definePageMeta({
    layout: "settings",
});

const { setPageHeader } = usePageHeader();
setPageHeader("Typography", "Customize your booklet's typography");

useSeoMeta({
    title: "Typography",
    description: "Customize your booklet's typography",
});

const { colors, loading, saveTheme, loadFont } = useTheme();

const toast = useToast();

const draft = reactive({
    headlineFont: colors.value.headlineFont,
    bodyFont: colors.value.bodyFont,
    headlineWeight: colors.value.headlineWeight,
    bodyWeight: colors.value.bodyWeight,
    headlineSize: colors.value.headlineSize,
    bodySize: colors.value.bodySize,
    headlineSpacing: colors.value.headlineSpacing,
    bodySpacing: colors.value.bodySpacing,
    headlineCase: colors.value.headlineCase,
    bodyCase: colors.value.bodyCase,
});

const isDirty = computed(() => {
    return Object.keys(draft).some(
        (key) =>
            draft[key as keyof typeof draft] !==
            colors.value[key as keyof typeof colors],
    );
});

async function handleSave() {
    const { error } = await saveTheme({
        ...colors.value,
        ...draft,
    });
    if (error) {
        toast.add({
            title: "Failed to save typography",
            description: error.message,
            color: "error",
            icon: "i-lucide-circle-x",
        });
    } else {
        toast.add({
            title: "Typography saved",
            description: "Your font changes are live across the booklet.",
            color: "success",
            icon: "i-lucide-circle-check",
        });
    }
}

async function resetToDefaults() {
    draft.headlineFont = DEFAULT_THEME_COLORS.headlineFont;
    draft.bodyFont = DEFAULT_THEME_COLORS.bodyFont;
    draft.headlineWeight = DEFAULT_THEME_COLORS.headlineWeight;
    draft.bodyWeight = DEFAULT_THEME_COLORS.bodyWeight;
    draft.headlineSize = DEFAULT_THEME_COLORS.headlineSize;
    draft.bodySize = DEFAULT_THEME_COLORS.bodySize;
    draft.headlineSpacing = DEFAULT_THEME_COLORS.headlineSpacing;
    draft.bodySpacing = DEFAULT_THEME_COLORS.bodySpacing;
    draft.headlineCase = DEFAULT_THEME_COLORS.headlineCase;
    draft.bodyCase = DEFAULT_THEME_COLORS.bodyCase;
}

const GOOGLE_FONTS_API = "https://www.googleapis.com/webfonts/v1/webfonts";

async function fetchFonts() {
    try {
        const config = useRuntimeConfig();
        const apiKey = config.public.googleFontsKey;

        const data = await $fetch<{ items: any[] }>(
            `${GOOGLE_FONTS_API}?key=${apiKey}`,
        );
        return data.items;
    } catch (e) {
        console.error("Failed to fetch Google Fonts", e);
        return [];
    }
}

const allFonts = ref<any[]>([]);
const loadingFonts = ref(false);

async function loadFonts() {
    loadingFonts.value = true;
    allFonts.value = await fetchFonts();
    loadingFonts.value = false;
}

onMounted(() => {
    loadFonts();
});

const fontOptions = computed(() => {
    return allFonts.value.map((f) => ({ label: f.family, value: f.family }));
});

const options = {
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    sizes: ["sm", "md", "lg", "xl"],
    spacings: [
        { label: "Narrowest", value: "-0.05em" },
        { label: "Narrow", value: "-0.025em" },
        { label: "Normal", value: "normal" },
        { label: "Wide", value: "0.025em" },
        { label: "Widest", value: "0.05em" },
    ],
    cases: ["none", "uppercase", "lowercase", "capitalize"],
};

const getStyle = (type: "headline" | "body") => {
    const prefix = type === "headline" ? "headline" : "body";
    return {
        fontFamily: `"${draft[(prefix + "Font") as keyof typeof draft]}", sans-serif`,
        fontWeight: draft[(prefix + "Weight") as keyof typeof draft],
        fontSize:
            draft[(prefix + "Size") as keyof typeof draft] === "sm"
                ? "0.875rem"
                : draft[(prefix + "Size") as keyof typeof draft] === "md"
                  ? "1rem"
                  : draft[(prefix + "Size") as keyof typeof draft] === "lg"
                    ? "1.125rem"
                    : "1.5rem",
        letterSpacing: draft[(prefix + "Spacing") as keyof typeof draft],
        textTransform: draft[(prefix + "Case") as keyof typeof draft],
    };
};
</script>

<template>
    <div class="w-full flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Headline Font -->
            <UCard
                class="w-full bg-white dark:bg-black border-muted border"
                variant="subtle"
                :ui="{
                    header: 'p-4 bg-muted border-none shadow-md shadow-zinc-500/10',
                }"
            >
                <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-type" class="size-4 text-muted" />
                        <span class="font-semibold text-sm"
                            >Headline Typography</span
                        >
                    </div>
                </template>

                <div class="flex flex-col gap-6 p-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-xs text-muted font-medium"
                            >Font Family</label
                        >
                            <USelectMenu
                                v-model="draft.headlineFont"
                                :items="fontOptions"
                                value-key="value"
                                virtualize
                                searchable
                                placeholder="Select a font"
                            >
                                <template #item="{ item }">
                                    <span 
                                        :style="{ fontFamily: item.value + ', sans-serif' }"
                                        @mouseenter="loadFont(item.value)"
                                    >
                                        {{ item.label }}
                                    </span>
                                </template>
                            </USelectMenu>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Weight</label
                            >
                            <USelectMenu
                                v-model="draft.headlineWeight"
                                :items="options.weights"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Size</label
                            >
                            <USelectMenu
                                v-model="draft.headlineSize"
                                :items="options.sizes"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Spacing</label
                            >
                            <USelectMenu
                                v-model="draft.headlineSpacing"
                                :items="options.spacings"
                                value-key="value"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Case</label
                            >
                            <USelectMenu
                                v-model="draft.headlineCase"
                                :items="options.cases"
                            />
                        </div>
                    </div>

                    <div
                        class="p-4 rounded-lg border border-default bg-elevated text-center"
                    >
                        <p :style="getStyle('headline')" class="font-bold">
                            The quick brown fox jumps over the lazy dog
                        </p>
                    </div>
                </div>
            </UCard>

            <!-- Body Font -->
            <UCard
                class="w-full bg-white dark:bg-black border-muted border"
                variant="subtle"
                :ui="{
                    header: 'p-4 bg-muted border-none shadow-md shadow-zinc-500/10',
                }"
            >
                <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-type" class="size-4 text-muted" />
                        <span class="font-semibold text-sm"
                            >Body Typography</span
                        >
                    </div>
                </template>

                <div class="flex flex-col gap-6 p-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-xs text-muted font-medium"
                            >Font Family</label
                        >
                            <USelectMenu
                                v-model="draft.bodyFont"
                                :items="fontOptions"
                                value-key="value"
                                virtualize
                                searchable
                                placeholder="Select a font"
                            >
                                <template #item="{ item }">
                                    <span 
                                        :style="{ fontFamily: item.value + ', sans-serif' }"
                                        @mouseenter="loadFont(item.value)"
                                    >
                                        {{ item.label }}
                                    </span>
                                </template>
                            </USelectMenu>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Weight</label
                            >
                            <USelectMenu
                                v-model="draft.bodyWeight"
                                :items="options.weights"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Size</label
                            >
                            <USelectMenu
                                v-model="draft.bodySize"
                                :items="options.sizes"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Spacing</label
                            >
                            <USelectMenu
                                v-model="draft.bodySpacing"
                                :items="options.spacings"
                                value-key="value"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs text-muted font-medium"
                                >Case</label
                            >
                            <USelectMenu
                                v-model="draft.bodyCase"
                                :items="options.cases"
                            />
                        </div>
                    </div>

                    <div
                        class="p-4 rounded-lg border border-default bg-elevated text-center"
                    >
                        <p :style="getStyle('body')" class="text-sm">
                            The quick brown fox jumps over the lazy dog. This is
                            a sample of the body text used throughout the
                            booklet.
                        </p>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Live Preview -->
        <UCard
            class="w-full bg-white dark:bg-black border-muted border"
            variant="soft"
            :ui="{
                header: 'p-4 bg-muted border-none shadow-md shadow-zinc-500/10',
            }"
        >
            <template #header>
                <h3 class="font-semibold text-sm">Live Preview</h3>
            </template>
            <div class="rounded-lg p-6 border border-default transition-colors">
                <h2 :style="getStyle('headline')" class="mb-1">
                    Sample Venue Booklet
                </h2>
                <p :style="getStyle('body')" class="mb-4">
                    This is how your fonts will look across the booklet.
                    Headlines use the headline font and body font settings.
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        :style="getStyle('body')"
                        class="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-500"
                    >
                        Primary Action
                    </button>
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
                Save Typography
            </UButton>
        </div>
    </div>
</template>
