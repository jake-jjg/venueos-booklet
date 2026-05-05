<script setup lang="ts">
definePageMeta({
  layout: "settings",
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
const { booklet_modules, getbooklet_modules } = useVenue();
const toast = useToast();

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
const content = ref("");
const loading = ref(false);

// Track dirty state
const isDirty = computed(() => {
  return (
    title.value !== "" ||
    description.value !== "" ||
    icon.value !== "i-lucide-file" ||
    content.value !== ""
  );
});

// Reset to defaults
function resetToDefaults() {
  title.value = "";
  description.value = "";
  icon.value = "i-lucide-file";
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
    // Store content as Markdown string directly
    const newModule = {
      venue_id: config.public.venueId,
      title: title.value.trim(),
      description: description.value.trim(),
      icon: icon.value,
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
    />

    <!-- Editor for content modules -->
    <template v-if="moduleType === 'content'">
      <UFormGroup label="Content">
        <UFormField label="Content">
          <UCard>
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
    <div class="flex items-center justify-between pt-4 border-t border-default">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-rotate-ccw"
        :disabled="loading || !isDirty"
        @click="resetToDefaults"
      >
        Reset to defaults
      </UButton>
      <UButton
        color="primary"
        icon="i-lucide-save"
        :loading="loading"
        :disabled="!isDirty || !title.trim()"
        @click="handleSave"
      >
        Save Module
      </UButton>
    </div>
  </div>
</template>
