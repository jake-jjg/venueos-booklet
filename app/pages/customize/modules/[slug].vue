<script setup lang="ts">
definePageMeta({
    layout: "settings",
});

const route = useRoute();
const supabase = useSupabaseClient();
const { booklet_modules, getbooklet_modules, venue_info } = useVenue();
const { setPageHeader } = usePageHeader();

// File upload composable
const {
    uploadFile,
    uploading: uploadingFile,
    error: uploadError,
} = useStorageUpload();

const slug = route.params.slug as string;
const toast = useToast();

// Form state
const title = ref("");
const description = ref("");
const icon = ref("i-lucide-file");
const coverImage = ref("");
const coverImageFile = ref<File | null>(null);
const content = ref("");
const loading = ref(false);
const contentType = ref("");

// Combined loading state
const isLoading = computed(() => loading.value || uploadingFile.value);

// Original values for dirty detection
const originalTitle = ref("");
const originalDescription = ref("");
const originalIcon = ref("");
const originalContent = ref("");
const originalCoverImage = ref("");

// Track dirty state
const isDirty = computed(() => {
    return (
        title.value !== originalTitle.value ||
        description.value !== originalDescription.value ||
        icon.value !== originalIcon.value ||
        content.value !== originalContent.value ||
        coverImage.value !== originalCoverImage.value ||
        coverImageFile.value !== null
    );
});

// Computed title and description for header — use stable fetched values, not form refs
const pageTitle = computed(() => `Edit Module: ${title.value || "Loading..."}`);
const pageHeaderDescription = computed(() => originalDescription.value);

// Set page header
setPageHeader(pageTitle, pageHeaderDescription);

// Fetch module
const {
    data: module,
    pending,
    error,
} = await useAsyncData(`module-${slug}`, async () => {
    // Try to find in cached state first
    let foundModule = booklet_modules.value.find((m) => m.id === slug);

    if (!foundModule) {
        // Fetch from Supabase
        const { data, error } = await supabase
            .from("booklet_modules")
            .select()
            .eq("id", slug)
            .single();

        if (error) throw error;
        foundModule = data;
    }

    return foundModule;
});

// Helper to extract markdown content from various formats
function extractMarkdownContent(rawContent: unknown): string {
    if (!rawContent) return "";

    // If it's already a string (Markdown), return it
    if (typeof rawContent === "string") {
        return rawContent;
    }

    // If it's a TipTap JSON object with a text representation
    if (typeof rawContent === "object" && rawContent !== null) {
        // Handle array of blocks (old format)
        if (Array.isArray(rawContent)) {
            return rawContent
                .map(
                    (block: { textContent?: string; text?: string }) =>
                        block.textContent || block.text || "",
                )
                .filter(Boolean)
                .join("\n\n");
        }

        // Handle TipTap JSON format
        const content = rawContent as { type?: string; content?: unknown[] };
        if (content.type === "doc" && Array.isArray(content.content)) {
            // Extract text from TipTap JSON structure
            return extractTextFromTipTapJson(content.content);
        }
    }

    return "";
}

// Recursively extract text from TipTap JSON content
function extractTextFromTipTapJson(nodes: unknown[]): string {
    const lines: string[] = [];

    for (const node of nodes) {
        if (typeof node !== "object" || node === null) continue;

        const typedNode = node as {
            type?: string;
            content?: unknown[];
            text?: string;
            attrs?: { level?: number };
        };

        if (typedNode.type === "paragraph" && typedNode.content) {
            const text = typedNode.content
                .map((child) =>
                    typeof child === "object" &&
                    child !== null &&
                    "text" in child
                        ? (child as { text: string }).text
                        : "",
                )
                .join("");
            lines.push(text);
        } else if (typedNode.type === "heading" && typedNode.content) {
            const level = typedNode.attrs?.level || 1;
            const text = typedNode.content
                .map((child) =>
                    typeof child === "object" &&
                    child !== null &&
                    "text" in child
                        ? (child as { text: string }).text
                        : "",
                )
                .join("");
            lines.push("#".repeat(level) + " " + text);
        } else if (typedNode.type === "text" && typedNode.text) {
            lines.push(typedNode.text);
        }
    }

    return lines.join("\n\n");
}

// Initialize form when module is loaded
watch(
    module,
    (newModule) => {
        if (newModule) {
            // Set title, description, icon
            originalTitle.value = newModule.title || "";
            originalDescription.value = newModule.description || "";
            originalIcon.value = newModule.icon || "i-lucide-file";
            contentType.value = newModule.content_type || "";

            title.value = originalTitle.value;
            description.value = originalDescription.value;
            icon.value = originalIcon.value;

            // Extract and set content as Markdown
            const markdownContent = extractMarkdownContent(newModule.content);
            originalContent.value = markdownContent;
            content.value = markdownContent;

            // Set cover image
            originalCoverImage.value = newModule.cover_image_url || "";
            coverImage.value = originalCoverImage.value;
        }
    },
    { immediate: true },
);

// Set SEO meta
useSeoMeta({
    title: pageTitle,
    description,
});

// Reset to original values
function resetToDefaults() {
    title.value = originalTitle.value;
    description.value = originalDescription.value;
    icon.value = originalIcon.value;
    content.value = originalContent.value;
    coverImage.value = originalCoverImage.value;
    coverImageFile.value = null;
}

// Handle save
async function handleSave() {
    if (!title.value.trim()) {
        toast.add({
            title: "Validation Error",
            description: "Please enter a module title",
            icon: "i-lucide-alert-circle",
            color: "error",
        });
        return;
    }

    loading.value = true;

    try {
        let coverImageUrl = coverImage.value;

        // Upload cover image if a new file was selected
        if (coverImageFile.value) {
            const venueName = venue_info.value[0]?.name || "venue";
            const result = await uploadFile(
                coverImageFile.value,
                venueName,
                "client-media",
            );

            if (result) {
                coverImageUrl = result.url;
            } else if (uploadError.value) {
                toast.add({
                    title: "Upload Error",
                    description: uploadError.value,
                    icon: "i-lucide-alert-circle",
                    color: "error",
                });
                loading.value = false;
                return;
            }
        }

        // Store content as Markdown string directly
        const updateData = {
            title: title.value.trim(),
            description: description.value.trim(),
            icon: icon.value,
            content: contentType.value === "content" ? content.value : null,
            cover_image_url: coverImageUrl || null,
        };

        const { error } = await supabase
            .from("booklet_modules")
            .update(updateData)
            .eq("id", slug);

        if (error) {
            throw error;
        }

        // Refresh modules list
        await getbooklet_modules();

        // Update original values
        originalTitle.value = title.value;
        originalDescription.value = description.value;
        originalIcon.value = icon.value;
        originalContent.value = content.value;
        originalCoverImage.value = coverImageUrl;
        coverImage.value = coverImageUrl;
        coverImageFile.value = null;

        toast.add({
            title: "Success",
            description: "Module saved successfully!",
            icon: "i-lucide-check-circle",
            color: "success",
        });
    } catch (error) {
        console.error("Error saving module:", error);
        toast.add({
            title: "Error",
            description: "Failed to save module. Please try again.",
            icon: "i-lucide-alert-circle",
            color: "error",
        });
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="w-full space-y-4">
        <!-- Error State -->
        <template v-if="error">
            <UCard class="border-error/20 bg-error/5">
                <template #header>
                    <div class="flex items-center gap-2 text-error">
                        <UIcon name="i-lucide-alert-circle" />
                        <span class="font-semibold">Error loading module</span>
                    </div>
                </template>
                <p class="text-sm text-muted">{{ error.message }}</p>
                <template #footer>
                    <UButton
                        :to="`/customize/modules/view`"
                        icon="i-lucide-arrow-left"
                        variant="outline"
                        size="sm"
                    >
                        Back to Modules
                    </UButton>
                </template>
            </UCard>
        </template>

        <!-- Loading State -->
        <template v-else-if="pending">
            <div class="space-y-4">
                <USkeleton class="h-10 w-full" />
                <USkeleton class="h-10 w-full" />
                <USkeleton class="h-10 w-full" />
                <USkeleton class="h-64 w-full" />
            </div>
        </template>

        <!-- Form Content -->
        <template v-else-if="module">
            <!-- Form Fields -->
            <ModuleFormFields
                v-model:title="title"
                v-model:description="description"
                v-model:icon="icon"
                v-model:coverImage="coverImage"
                v-model:coverImageFile="coverImageFile"
            />

            <!-- Editor for content modules -->
            <template v-if="contentType === 'content'">
                <UFormGroup label="Content"
                    ><UCard
                        class="w-full bg-white dark:bg-black border-muted border"
                        variant="soft"
                        :ui="{
                            header: 'bg-muted border-none shadow-md shadow-zinc-500/10',
                        }"
                    >
                        <Editor v-model="content" />
                    </UCard>
                </UFormGroup>
            </template>
            <template v-else>
                <div class="w-full p-4 bg-muted rounded-md text-muted">
                    This is a {{ contentType }} module.
                </div>
            </template>

            <!-- Save Bar -->
            <div
                class="flex items-center justify-between pt-4 border-t border-default"
            >
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-rotate-ccw"
                    :disabled="isLoading || !isDirty"
                    @click="resetToDefaults"
                >
                    Reset to defaults
                </UButton>
                <div class="flex items-center gap-2">
                    <UButton
                        :to="`/customize/modules/view`"
                        icon="i-lucide-arrow-left"
                        variant="outline"
                        :disabled="isLoading"
                    >
                        Back
                    </UButton>
                    <UButton
                        color="primary"
                        icon="i-lucide-save"
                        :loading="isLoading"
                        :disabled="!isDirty || !title.trim()"
                        @click="handleSave"
                    >
                        Save Module
                    </UButton>
                </div>
            </div>
        </template>
    </div>
</template>
