<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useSortable } from "@vueuse/integrations/useSortable";

definePageMeta({
  layout: "settings",
});

const { setPageHeader } = usePageHeader();
setPageHeader("All Modules", "Customize your booklet's modules");

const { open: openAddModuleSlideover } = useAddModuleSlideover();

useSeoMeta({
  title: "All Modules",
  description: "Customize your booklet's modules",
});

const { booklet_modules, updateModulePositions } = useVenue();
const toast = useToast();

const reordering = ref(false);
const saving = ref(false);

async function finishReordering() {
  saving.value = true;
  const { error } = await updateModulePositions(booklet_modules.value);
  saving.value = false;

  if (error) {
    toast.add({
      title: "Failed to save order",
      description: error.message,
      color: "error",
      icon: "i-lucide-circle-x",
    });
  } else {
    reordering.value = false;
    toast.add({
      title: "Order saved",
      description: "Module positions have been updated.",
      color: "success",
      icon: "i-lucide-circle-check",
    });
  }
}

type ModuleRow = (typeof booklet_modules.value)[number];

const columns: TableColumn<ModuleRow>[] = [
  {
    id: "drag",
    header: "",
    meta: {
      class: { th: "w-8 px-2", td: "w-8 px-2" },
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "content_type",
    header: "Module Type",
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "",
    meta: {
      class: {
        th: "text-right",
        td: "text-right",
      },
    },
  },
];

const addNewItems: DropdownMenuItem[] = [
  {
    label: "Select a Type",
    type: "label",
  },
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
    label: "Ameneties",
    icon: "i-lucide-list",
    to: "/customize/modules/add-new?module_type=ameneties",
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

// handle: ".drag-handle" means dragging only triggers when the user grabs
// the grip icon. When reordering=false the icon is hidden via v-if,
// so there is no handle in the DOM and rows cannot be dragged at all.
useSortable(".my-table-tbody", booklet_modules, {
  animation: 150,
  handle: ".drag-handle",
});
</script>

<template>
  <div class="w-full flex flex-col">
    <UFieldGroup class="mb-4 justify-self-end self-end">
      <UButton
        icon="i-lucide-square-plus"
        size="lg"
        @click="openAddModuleSlideover"
      >
        Add New Module
      </UButton>
    </UFieldGroup>

    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="reordering"
        class="flex items-center gap-1.5 text-muted text-xs mb-2"
      >
        <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
        <span>Drag rows by the handle to reorder</span>
      </div>
    </Transition>

    <UTable
      :data="booklet_modules"
      :columns="columns"
      :ui="{ tbody: 'my-table-tbody' }"
      class="border-default border rounded"
    >
      <template #drag-cell>
        <UIcon
          v-if="reordering"
          name="i-lucide-grip-vertical"
          class="drag-handle size-4 text-muted cursor-grab active:cursor-grabbing"
        />
      </template>

      <template #created_at-cell="{ row }">
        {{ new Date(row.original.created_at).toLocaleDateString() }}
      </template>

      <template #actions-cell="{ row }">
        <UButton
          :to="`/customize/modules/${row.original.id}`"
          variant="outline"
          size="md"
          :disabled="reordering"
        >
          Edit Module
        </UButton>
      </template>
    </UTable>
    <UButton
      :icon="reordering ? 'i-lucide-check' : 'i-lucide-arrow-up-down'"
      :color="reordering ? 'success' : 'neutral'"
      :variant="reordering ? 'solid' : 'outline'"
      :loading="saving"
      size="lg"
      class="mt-4 justify-self-start self-start"
      @click="reordering ? finishReordering() : (reordering = true)"
    >
      {{ reordering ? "Done" : "Reorder" }}
    </UButton>
  </div>
</template>
