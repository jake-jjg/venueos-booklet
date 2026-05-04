<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useSortable } from "@vueuse/integrations/useSortable";

definePageMeta({
  layout: {
    name: "settings",
    props: {
      title: "All Modules",
      description: "Customize your booklet's modules",
    },
  },
});

const { module_loading, booklet_modules } = useVenue();

type ModuleRow = (typeof booklet_modules.value)[number];

const columns: TableColumn<ModuleRow>[] = [
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
  },
  {
    label: "Pricing",
    icon: "i-lucide-dollar-sign",
  },
  {
    label: "Ameneties",
    icon: "i-lucide-list",
  },
  {
    label: "Gallery",
    icon: "i-lucide-images",
  },
  {
    label: "FAQ",
    icon: "i-lucide-circle-question-mark",
  },
  {
    label: "Virtual Tours",
    icon: "i-lucide-binoculars",
  },
];

useSortable(".my-table-tbody", booklet_modules, {
  animation: 150,
});
</script>

<template>
  <div class="w-full flex flex-col">
    <UFieldGroup class="mb-4 justify-self-end self-end">
      <UButton
        :to="`/customize/modules/add-new`"
        icon="i-lucide-square-plus"
        size="lg"
      >
        Add New Module
      </UButton>
      <UDropdownMenu
        :items="addNewItems"
        size="lg"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
        class="justify-self-end self-end"
      >
        <UButton icon="i-lucide-chevron-down" size="lg" />
      </UDropdownMenu>
    </UFieldGroup>

    <div class="flex items-center gap-1.5 text-muted text-xs mb-2">
      <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
      <span>Drag rows to reorder modules</span>
    </div>

    <UTable
      :data="booklet_modules"
      :columns="columns"
      :loading="module_loading"
      :ui="{ base: 'bg-elevated/50', tbody: 'my-table-tbody' }"
      class="border-default border rounded"
    >
      <template #created_at-cell="{ row }">
        {{ new Date(row.original.created_at).toLocaleDateString() }}
      </template>

      <template #actions-cell="{ row }">
        <UButton
          :to="`/customize/modules/${row.original.title.toLowerCase()}/`"
          variant="subtle"
          size="md"
        >
          Edit Module
        </UButton>
      </template>
    </UTable>
  </div>
</template>
