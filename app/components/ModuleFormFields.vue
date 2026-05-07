<script setup lang="ts">
const title = defineModel<string>("title", { required: true });
const description = defineModel<string>("description");
const coverImage = defineModel<string>("coverImage");
const coverImageFile = defineModel<File | null>("coverImageFile");
const icon = defineModel<string>("icon");

// Preview URL for the uploaded file
const previewUrl = ref<string | null>(null);

// Watch for file changes to generate preview
watch(coverImageFile, (newFile) => {
    if (newFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(newFile);
    } else if (!coverImage.value) {
        previewUrl.value = null;
    }
});

// Set preview from existing URL
watch(
    coverImage,
    (url) => {
        if (url && !coverImageFile.value) {
            previewUrl.value = url;
        }
    },
    { immediate: true },
);

// Handle file removal
function removeCoverImage() {
    coverImageFile.value = null;
    coverImage.value = "";
    previewUrl.value = null;
}
</script>

<template>
    <!-- Form Fields -->
    <div class="grid grid-cols-1 gap-4 w-full max-w-2xl">
        <UFormGroup label="Module Title" required>
            <UFormField label="Title">
                <UInput
                    v-model="title"
                    size="xl"
                    class="w-full"
                    placeholder="Enter module title"
                    icon="i-lucide-heading"
                />
            </UFormField>
        </UFormGroup>

        <UFormGroup label="Description">
            <UFormField label="Description">
                <UInput
                    v-model="description"
                    size="xl"
                    class="w-full"
                    placeholder="Brief description of this module"
                    icon="i-lucide-text"
                />
            </UFormField>
        </UFormGroup>

        <UFormGroup label="Cover Image">
            <UFormField label="Cover Image">
                <template v-if="previewUrl">
                    <div class="space-y-2">
                        <div
                            class="relative w-full aspect-video rounded-lg overflow-hidden border border-default"
                        >
                            <img
                                :src="previewUrl"
                                alt="Cover image preview"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <UButton
                            color="error"
                            variant="outline"
                            icon="i-lucide-trash-2"
                            size="sm"
                            @click="removeCoverImage"
                        >
                            Remove Image
                        </UButton>
                    </div>
                </template>
                <template v-else>
                    <UFileUpload
                        v-model="coverImageFile"
                        accept="image/*"
                        icon="i-lucide-image"
                        label="Drop your image here"
                        description="SVG, PNG, JPG or GIF (max. 2MB)"
                        class="w-full"
                    />
                </template>
            </UFormField>
        </UFormGroup>

        <UFormGroup label="Icon">
            <UFormField label="Icon">
                <IconPicker v-model="icon" class="w-full" />
            </UFormField>
        </UFormGroup>
    </div>
</template>
