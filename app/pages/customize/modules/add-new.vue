<script setup lang="ts">
definePageMeta({
    layout: "settings",
});

const route = useRoute();
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
const { booklet_modules, getbooklet_modules, venue_info } = useVenue();
const toast = useToast();

// File upload composable
const {
    uploadFile,
    uploading: uploadingFile,
    error: uploadError,
} = useStorageUpload();

const moduleType = route.query.module_type as string;

const pageTitle = computed(
    () =>
        `Add New ${moduleType?.charAt(0).toUpperCase()}${moduleType?.slice(1)} Module`,
);
const pageDescription = "Create and configure a new module for your booklet";

const { setPageHeader } = usePageHeader();
setPageHeader(pageTitle, pageDescription);

useSeoMeta({
    title: pageTitle,
    description: pageDescription,
});

// Form state
const title = ref("");
const description = ref("");
const icon = ref("i-lucide-file");
const coverImage = ref("");
const coverImageFile = ref<File | null>(null);
const content = ref("");
const loading = ref(false);

// Combined loading state
const isLoading = computed(() => loading.value || uploadingFile.value);

// Track dirty state
const isDirty = computed(() => {
    return (
        title.value !== "" ||
        description.value !== "" ||
        icon.value !== "i-lucide-file" ||
        content.value !== "" ||
        coverImageFile.value !== null
    );
});

// Reset to defaults
function resetToDefaults() {
    title.value = "";
    description.value = "";
    icon.value = "i-lucide-file";
    coverImage.value = "";
    coverImageFile.value = null;
    content.value = "";
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
        let coverImageUrl = null;

        // Upload cover image if one is selected
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
                // Show upload error
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
        const newModule = {
            venue_id: config.public.venueId,
            title: title.value.trim(),
            description: description.value.trim(),
            icon: icon.value,
            cover_image_url: coverImageUrl,
            content_type: moduleType,
            content: moduleType === "content" ? content.value : null,
            module_position: booklet_modules.value.length + 1,
        };

        const { data, error } = await supabase
            .from("booklet_modules")
            .insert([newModule])
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Refresh modules list
        await getbooklet_modules();

        // Navigate to edit page
        await navigateTo(`/customize/modules/${data.id}`);
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
        <!-- Form Fields -->
        <ModuleFormFields
            v-model:title="title"
            v-model:description="description"
            v-model:icon="icon"
            v-model:coverImage="coverImage"
            v-model:coverImageFile="coverImageFile"
        />

        <!-- Editor for content modules -->
        <template v-if="moduleType === 'content'">
            <UFormGroup label="Content">
                <UFormField label="Content">
                    <UCard
                        class="w-full bg-white dark:bg-black border-muted border"
                        variant="soft"
                        :ui="{
                            header: 'bg-muted border-none shadow-md shadow-zinc-500/10',
                        }"
                    >
                        <Editor v-model="content" />
                    </UCard>
                </UFormField>
            </UFormGroup>
        </template>
        <template v-else>
            <div class="w-full p-4 bg-muted rounded-md text-muted">
                Add a new {{ moduleType }} module.
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
